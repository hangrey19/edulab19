const fs = require('fs-extra');
const cloudinary = require('../cloudinary/configCloudinary');
const mongoose = require('mongoose');

const Homework = require('../models/Homework');
const Classroom = require('../models/Classroom');
const Submission = require('../models/Submission');

saveHomeworkToMongodb = async (
    _id,
    classroomId,
    title,
    creatorId,
    description,
    deadline,
    attachedFiles,
    fileAttributes,
    topic,
    duplicateTopicId
) => {
    const newHomework = new Homework({
        _id,
        classroomId,
        title,
        creatorId,
        description,
        deadline,
        attachedFiles,
        fileAttributes,
        topic,
    });
    await newHomework.save();
    createFakeSubmissionForEveryMemberInClass(classroomId, _id);

    // Push new homework to list homework of class
    await Classroom.updateOne(
        { 'topicHomework._id': duplicateTopicId },
        { $push: { 'topicHomework.$.homeworks': _id } }
    );
};

createFakeSubmissionForEveryMemberInClass = async (classroomId, homeworkId) => {
    // When teacher create homework, every student in class have default submission
    const classMember = await Classroom.findOne(
        { _id: classroomId },
        'listStudent'
    );

    const markDone = false;
    const attachedFiles = [];
    classMember.listStudent.forEach(async (studentId) => {
        const newSubmission = new Submission({
            homeworkId,
            studentId,
            markDone,
            attachedFiles,
        });
        await newSubmission.save();
    });
};

const max = (a, b) => {
    return a > b ? a : b;
};

const reverseHomeworkIn1Topic = (topic) => {
    /*  New homework is pushed at tail of homeworks array
     *  We need to reverse homeworks array so the new homework will hoist to top
     */
    const n = topic.homeworks.length;
    for(let i = 0; i <= max(n / 2 - 1, 0); i++) {
        const temp = topic.homeworks[i];
        topic.homeworks[i] = topic.homeworks[n - 1 - i];
        topic.homeworks[n - 1 - i] = temp;
    }
};

const reverseTopic = (topics) => {
    /* New topic is pushed at tail of topics array
     * We need to reverse topics array so the new topic will hoist to top
     */
    const n = topics.length;
    for(let i = 0; i <= max(n / 2 - 1, 0); i++) {
        const temp = topics[i];
        topics[i] = topics[n - 1 - i];
        topics[n - 1 - i] = temp;

        reverseHomeworkIn1Topic(topics[i]);
        if(n > 1 )  reverseHomeworkIn1Topic(topics[n - 1 - i]);
    }
};

const addNewTopic = async (classroomId, topic) => {
    var myId = mongoose.Types.ObjectId();
    await Classroom.updateOne(
        { _id: classroomId },
        { $push: { topicHomework: { _id: myId, topic: topic, homeworks: [] } } }
    );
    return myId;
};

const checkIfDuplicate = async (classroomId, topic) => {
    /* check if we have same topic in class
     * return id of topic if yes, otherwise is null
     * return array of topics can be used for check if we have homework with same title in class
     */
    const updatedClassroom = await Classroom.findOne(
        { _id: classroomId },
        'topicHomework'
    ).populate({
        path: 'topicHomework.homeworks',
        select: 'title',
    });

    const topics = updatedClassroom.topicHomework;
    var duplicateTopicId = null;
    var isTheLastHomeworkOfTopic = false;

    for(let i = 0; i < topics.length; i++) {
        if(topics[i].topic === topic) {
            duplicateTopicId = topics[i]._id;

            if(topics[i].homeworks.length == 1) {
                isTheLastHomeworkOfTopic = true;
            }
            break;
        }
    }
    return { duplicateTopicId, topics, isTheLastHomeworkOfTopic };
};

Number.prototype.padLeft = function (base, chr) {
    var len = String(base || 10).length - String(this).length + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

const changeDeadlineISOToDeadline = (deadlineISO) => {
    const d = new Date(deadlineISO);
    const deadline =
        [
            (d.getMonth() + 1).padLeft(),
            d.getDate().padLeft(),
            d.getFullYear(),
        ].join('/') + ' ' + 
        [
            d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft(),
        ].join(':');
    return deadline;
};

const checkIfDuplicateTitle = (topics, title, homeworkId) => {
    // Check if exists another documents with the same title in class
    for(let i = 0; i < topics.length; i++) {
        for(let j = 0; j < topics[i].homeworks.length; j++) {
            if(
                topics[i].homeworks[j].title === title &&
                topics[i].homeworks[j]._id != homeworkId
            ) {
                return true;
            }
        }
    }
    return false;
};

const getIdOfTopic = (topics, topic) => {
    var topicId = null;
    
    for(let i = 0; i < topics.length; i++) {
        if(topics[i].topic === topic) {
            topicId = topics[i]._id;
            break;
        }
    }
    return topicId;
};

const removeHomeworkOutOfTopic = async (
    duplicateTopicId,
    homeworkId,
    classroomId,
    isTheLastHomeworkOfTopic
) => {
    if(isTheLastHomeworkOfTopic) {
        await Classroom.updateOne(
            { _id: classroomId },
            { $push: { topicHomework: { _id: duplicateTopicId } } }
        );
    }
    else {
        await Classroom.updateOne(
            { 'topicHomework._id': duplicateTopicId },
            { $push: { 'topicHomework.$.homeworks': homeworkId } }
        );
    }
};

const changeTopic = async(
    duplicateTopicId,
    topicId,
    topic,
    homeworkId,
    classroomId,
    isTheLastHomeworkOfTopic
) => {
    await removeHomeworkOutOfTopic(
        duplicateTopicId,
        homeworkId,
        classroomId,
        isTheLastHomeworkOfTopic
    );
    if(!topicId) {
        topicId = await addNewTopic(classroomId, topic);
    }
    await Classroom.updateOne(
        { 'topicHomework._id': topicId },
        { $push: { 'topicHomework.$.homeworks': homeworkId } }
    );
};

const getFilenameFromURL = (url) => {
    if(!url)    return '';

    const splited = url.split('/');
    const lastPart = splited[splited.length - 1] || '';
    const filename = lastPart.split('?')[0];
    return decodeURIComponent(filename);
};

convertSizeToProperUnit = (bytes) => {
    var i = 0;
    while (bytes >= 1024) {
        i++;
        bytes = bytes / 1024;
    }
    bytes = Math.round(bytes * 100) / 100;
    return `${bytes} ${unitTable[i]}`;
};

getFileExtension = (filename) => {
    var i = filename.length - 1;
    while (filename[i] != '.') {
        i = i - 1;
    }
    return filename.substring(i + 1);
}

const getPublicIdFromUrl = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    const fileWithExtension = parts.slice(6).join('/'); // Bỏ domain + version
    const publicId = fileWithExtension.split('.')[0];
    return publicId;
};

const deleteFolderInCloudinary = async (folderPath) => {
    try {
        const { resources } = await cloudinary.search
            .expression(`folder:${folderPath}`)
            .execute();

        if (resources.length === 0) return;

        const publicIds = resources.map(file => file.public_id);

        for (const publicId of publicIds) {
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (err) {
        console.error('Error deleting folder in Cloudinary:', err);
    }
};

class HomeworkController {
    createHomework = async (req, res) => {
        try {
            const { title, content, classId, subjectId, deadline } = req.body;
            const files = req.files;

            if(!title || !content || !classId || !subjectId || !deadline) {
                return res.status(400).json({ message: "Chưa nhập đầy đủ thông tin" });
            }

            const fileAttributes = [];
            const attachedFiles = [];

            // Xử lí upload từng file lên Cloudinary
            if(files.length > 0) {
                for(const file of files) {
                    const uploadResult = await cloudinary.uploader.upload(file.path, {
                        folder: `homework`,
                        resource_type: "auto",
                    });

                    attachedFiles.push(uploadResult.secure_url);

                    fileAttributes.push({
                        filename: file.originalname,
                        size: file.size,
                        fileType: file.mimetype,
                    });
                }

                // Xóa local uploads sau khi upload xong
                await fs.emptyDir('uploads/');
            }

            // Tạo bài tập mới
            const newHomework = new Homework({
                title,
                content,
                classId,
                subjectId,
                deadline,
                attachedFiles,
                fileAttributes,
            });
            
            await newHomework.save();

            return res.status(201).json({ message: "Tạo bài tập thành công !", homework: newHomework });
        }
        catch (error) {
            console.error('Có lỗi khi tạo bài tập: ', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi server !' });
        }
    };

    removeHomework = (req, res) => {};

    editHomeworkDeadline = async (req, res) => {
        try {
            const classroomId = req.body.classroomId;
            const title = req.body.title;
            const newDeadline = req.body.newDeadline;

            await Homework.updateOne(
                { classroomId: classroomId, title: title },
                { $set: { deadline: newDeadline } }
            );
            return res.status(200).json({ success: true, message: 'Hạn nộp bài đã được thay đổi !' });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ success: false, message: 'Lỗi khi thay đổi hạn nộp bài !' });
        }
    };

    getAllHomeworkMetadataOfClass = async (req, res) => {
        // Return title and deadline of all homework in 1 class
        const classroomId = req.body.classroomId;
        const topicHomework = await Classroom.findOne(
            { _id: classroomId },
            'topicHomework'
        ).populate({
            path: 'topicHomework.homeworks',
            select: 'title deadline fileAttributes',
        });

        const topics = topicHomework.topicHomework;
        if(topics.length === 0) {
            return res.status(200).json(topics);
        }

        // Need to reverse topics so newly topic will hoist to top
        reverseTopic(topics);
        return res.status(200).json(topics);
    };

    getHomeworkDetail = async (req, res) => {
        // Get all information about homework
        try {
            const homeworkId = req.body.homeworkId;
            const homework = await Homework.findOne({ _id: homeworkId });

            if(!homework) {
                throw new Error('Not exists');
            }

            var filename;
            if(homework.attachedFiles.length > 0) {
                filename = getFilenameFromURL(homework.attachedFiles[0]);
            }
            else {
                filename = undefined;
            }
            return res.status(200).json({ success: true, homework, filename });
        }
        catch (err) {
            if(err.message == 'Not exists') {
                return res.status(400).json({ success: false, message: "Homework doesn't exists" });
            }
            else {
                console.log(err);
                return res.status(400).json('ERROR');
            }
        }
    };

    changeHomework = async (req, res) => {
        try {
            const homeworkId = req.body.homeworkId;
            const title = req.body.title;
            const description = req.body.description;
            const topic = req.body.topic;
            const deadlineISO = req.body.deadline;
            const deadline = changeDeadlineISOToDeadline(deadlineISO);

            const updatedHomework = await Homework.findOne({ _id: homeworkId });
            if(!updatedHomework) {
                throw new Error('No homework');
            }

            const classId = updatedHomework.classroomId;
            const oldTopic = updatedHomework.topic;

            var { duplicateTopicId, topics, isTheLastHomeworkOfTopic } = await checkIfDuplicate(classId, oldTopic);
            const isTitleExist = checkIfDuplicateTitle(
                topics,
                title,
                homeworkId
            );

            if(isTitleExist) {
                throw new Error('2 homeworks have the same title in 1 class');
            }

            // Consider to erase this block of code
            if(!duplicateTopicId) {
                throw new Error('ERROR');
            }

            var topicId = getIdOfTopic(topics, topic);
            if(oldTopic != topic) {
                await changeTopic(
                    duplicateTopicId,
                    topicId,
                    topic,
                    homeworkId,
                    classId,
                    isTheLastHomeworkOfTopic
                );
            }

            await Homework.findOneAndUpdate(
                { _id: homeworkId },
                {
                    $set: {
                        title: title,
                        description: description,
                        topic: topic,
                        deadline: deadline,
                    },
                }
            );
            return res.status(200).json({ success: true, message: 'Change homework successfully' });
        }
        catch (err) {
            if(err.message == '2 homeworks have the same title in 1 class') {
                return res.status(400).json({ success: false, message: 'Một lớp không thể có 2 bài tập cùng tên !' });
            }
            else if(err.message === 'No homework') {
                return res.status(400).json({ success: true, message: 'Bài tập không tồn tại hoặc đã bị xóa !' });
            }
            else {
                console.log(err);
                res.status(400).json({ success: false, message: 'ERROR' });
            }
        }
    };

    changeHomeworkFile = async (req, res) => {
        try {
            const homeworkId = req.body.homeworkId;
            const file = req.file;

            const updatedHomework = await Homework.findOne({ _id: homeworkId });
            if(!updatedHomework) {
                throw new Error('No homework');
            }
            
            // Xóa file cũ nếu có trên Cloudinary
            if(updatedHomework.attachedFiles && updatedHomework.attachedFiles.length > 0) {
                // Giả sử attachedFiles lưu url dạng đầy đủ
                for (const url of updatedHomework.attachedFiles) {
                    const publicId = getPublicIdFromUrl(url);
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Nếu không upload file mới -> chỉ update lại thành [].
            if (!file) {
                await Homework.updateOne(
                    { _id: homeworkId },
                    { $set: { attachedFiles: [], fileAttributes: [] } }
                );
                return res.status(200).json({
                    success: true,
                    message: 'Đã xóa file cho bài tập này',
                });
            }

            // Upload file mới lên Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: `homework/${homeworkId}`, 
                resource_type: 'auto' 
            });

            const url = uploadResult.secure_url; // Lấy url sau khi upload
            const size = convertSizeToProperUnit(file.size);
            const extension = getFileExtension(file.originalname);
            const fileAttribute = {
                name: file.originalname,
                size: size,
                extension: extension,
            };
            const fileAttributes = [fileAttribute];

            await Homework.updateOne(
                { _id: homeworkId },
                {
                    $set: {
                        attachedFiles: [url],
                        fileAttributes: fileAttributes,
                    },
                }
            );

            // Xóa file tạm local
            await fs.emptyDir('uploads/');

            return res.status(200).json({
                success: true,
                message: 'Thay đổi file cho bài tập thành công',
            });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'ERROR' });
        }
    };

    eraseHomework = async (req, res) => {
        try {
            const homeworkId = req.body.homeworkId;
            console.log(homeworkId);
    
            const updatedHomework = await Homework.findOne(
                { _id: homeworkId },
                'classroomId topic attachedFiles'
            );
            if (!updatedHomework) {
                throw new Error('No document');
            }
            const classroomId = updatedHomework.classroomId;
            const topic = updatedHomework.topic;
    
            // Xử lý xóa topic
            const { duplicateTopicId, topics, isTheLastHomeworkOfTopic } =
                await checkIfDuplicate(classroomId, topic);
    
            await removeHomeworkOutOfTopic(
                duplicateTopicId,
                homeworkId,
                classroomId,
                isTheLastHomeworkOfTopic
            );
    
            // Xóa submissions trong database
            await Homework.findOneAndDelete({ _id: homeworkId });
            await Submission.deleteMany({ homeworkId: homeworkId });
    
            // Xóa file homework trên Cloudinary
            if (updatedHomework.attachedFiles && updatedHomework.attachedFiles.length > 0) {
                for (const url of updatedHomework.attachedFiles) {
                    const publicId = getPublicIdFromUrl(url);
                    await cloudinary.uploader.destroy(publicId);
                }
            }
    
            // Xóa các submission files trên Cloudinary (nếu bạn cũng upload submission lên cloudinary)
            const submissionFolderPath = `submission/${homeworkId}`;
            await deleteFolderInCloudinary(submissionFolderPath);
    
            return res.status(200).json({ success: true, message: 'Xóa thành công' });
        } catch (err) {
            if (err.message === 'No document') {
                return res.status(400).json({
                    success: true,
                    message: 'Bài tập không tồn tại hoặc đã bị xóa',
                });
            } else {
                console.error(err);
                return res.status(400).json({
                    success: false,
                    message: 'Lỗi rồi',
                });
            }
        }
    };
}

module.exports = new HomeworkController();