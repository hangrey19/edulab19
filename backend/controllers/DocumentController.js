const cloudinary = require('../cloudinary/configCloudinary');
const Document = require('../models/Document');
const Classroom = require('../models/Classroom');
const mongoose = require('mongoose');
const fs = require('fs-extra');

const unitTable = ['B', 'KB', 'MB', 'GB', 'TB'];

// Helper functions
const convertSizeToProperUnit = (bytes) => {
    let i = 0;
    while(bytes >= 1024 && i < unitTable.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${Math.round(bytes * 100) / 100} ${unitTable[i]}`;
};

const getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.') + 1);
};

const saveDocumentToMongoDB = async (
    _id, classroomId, title, description, creatorId, attachedFiles, fileAttributes, topic, duplicateTopicId
) => {
    const newDocument = new Document({
        _id, classroomId, title, description, creatorId, attachedFiles, fileAttributes, topic,
    });
    await newDocument.save();

    await Classroom.updateOne(
        { 'topicDocument._id': duplicateTopicId },
        { $push: { 'topicDocument.$.documents': _id } }
    );
};

const addNewTopic = async (classroomId, topic) => {
    const topicId = mongoose.Types.ObjectId();
    await Classroom.updateOne(
        { _id: classroomId },
        { $push: { topicDocument: { _id: topicId, topic, documents: [] } } }
    );
    return topicId;
};

const checkIfDuplicate = async (classroomId, topic) => {
    /* check if topic exists in class
     * return _id of topic if yes, otherwise return null
     * return topics array used for check title in next step
     */
    const updatedClassroom = await Classroom.findOne(
        { _id: classroomId },
        'topicDocument'
    ).populate({
        path: 'topicDocument.documents',
        select: 'title',
    });
    const topics = updatedClassroom.topicDocument;
    var isTheLastDocumentOfTopic = false;
    var duplicateTopicId = null;
    for (let i = 0; i < topics.length; i++) {
        if (topics[i].topic === topic) {
            duplicateTopicId = topics[i]._id;
            if (topics[i].documents.length == 1) {
                isTheLastDocumentOfTopic = true;
            }
            break;
        }
    }
    return { duplicateTopicId, topics, isTheLastDocumentOfTopic };
};

const checkIfDuplicateTitle = (topics, title, currentDocumentId = null) => {
    return topics.some(topic =>
        topic.documents.some(doc =>
            doc.title === title && doc._id.toString() !== currentDocumentId?.toString()
        )
    );
};

const reverseDocumentIn1Topic = (topic) => {
    /* new document will be pushed at tail of array documents
     * we need to reverse documents array so new document will hoist to top of documents array
     */
    const n = topic.documents.length;
    for (let i = 0; i <= (n - 1) / 2; i++) {
        const temp = topic.documents[i];
        topic.documents[i] = topic.documents[n - 1 - i];
        topic.documents[n - 1 - i] = temp;
    }
};

const reverseTopic = (topics) => {
    /* new topic will be pushed at tail of topics array
       we need to reverse topics array so new topic will hoist to top of topics array
     */
    const n = topics.length;
    for (let i = 0; i <= (n - 1) / 2; i++) {
        const temp = topics[i];
        topics[i] = topics[n - 1 - i];
        topics[n - 1 - i] = temp;
        reverseDocumentIn1Topic(topics[i]);
        if (n > 1) reverseDocumentIn1Topic(topics[n - 1 - i]);
    }
};

const getIdOfTopic = (topics, topic) => {
    var topicId = null;
    for (let i = 0; i < topics.length; i++) {
        if (topics[i].topic === topic) {
            topicId = topics[i]._id;
            break;
        }
    }
    return topicId;
};

const removeDocumentOutOfTopic = async (
    duplicateTopicId,
    documentId,
    classroomId,
    isTheLastDocumentOfTopic
) => {
    if (isTheLastDocumentOfTopic) {
        await Classroom.updateOne(
            { _id: classroomId },
            { $pull: { topicDocument: { _id: duplicateTopicId } } }
        );
    } else
        await Classroom.updateOne(
            { 'topicDocument._id': duplicateTopicId },
            { $pull: { 'topicDocument.$.documents': documentId } }
        );
};

const getFilenameFromURL = (url) => {
    const splited = url.split('/');
    console.log(splited);
    const result = splited[splited.length - 1].split('?')[0];
    return result.replace('%20', ' ');
};

const changeTopic = async (
    duplicateTopicId,
    topicId,
    topic,
    documentId,
    classroomId,
    isTheLastDocumentOfTopic
) => {
    await removeDocumentOutOfTopic(
        duplicateTopicId,
        documentId,
        classroomId,
        isTheLastDocumentOfTopic
    );
    if (!topicId) {
        topicId = await addNewTopic(classroomId, topic);
    }
    await Classroom.updateOne(
        { 'topicDocument._id': topicId },
        { $push: { 'topicDocument.$.documents': documentId } }
    );
};

// Controller
class DocumentController {
    upload = async (req, res) => {
        try {
            const { classroomId, title, description, topic } = req.body;
            const creatorId = req.userId;
            const file = req.file;

            let { duplicateTopicId, topics } = await checkIfDuplicateTopic(classroomId, topic);
            const titleExists = checkIfDuplicateTitle(topics, title);

            if(titleExists) {
                return res.status(400).json({ success: false, message: 'Không thể tồn tại 2 tài liệu cùng tên trong 1 lớp !' })
            }

            if(!duplicateTopicId) {
                duplicateTopicId = await addNewTopic(classroomId, topic);
            }

            const attachedFiles = [];
            const fileAttributes = [];
            const documentId = mongoose.Types.ObjectId();

            if(file) {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: `documents/${documentId}`,
                    resource_type: 'auto',
                });

                const size = convertSizeToProperUnit(file.size);
                const extension = getFileExtension(file.originalname);

                const fileAttribute = { name: file.originalname, size, extension };
                fileAttributes.push(fileAttribute);

                attachedFiles.push(result.secure_url);

                // Clean up local file
                await fs.emptyDir('uploads/');
            }

            await saveDocumentToMongoDB(
                documentId,
                classroomId,
                title,
                description,
                creatorId,
                attachedFiles,
                fileAttributes,
                topic,
                duplicateTopicId
            );

            return res.status(200).json({ success: true, message: 'Đã tải lên tài liệu !' });
        }
        catch (err) {
            console.error('Lỗi tải lên: ', err);
            res.status(400).json({ success: false, message: 'Đã xảy ra lỗi khi tải lên !' });
        }
    };

    download = async (req, res) => {
        try {
            const { documentId } = req.body;
            const document = await Document.findById(documentId);

            if(!document) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu !' });
            }

            return res.status(200).json({ success: true, document });
        }
        catch (err) {
            console.error('Lỗi khi tải xuống: ', err);
            res.status(400).json({ success: false, message: 'Đã xảy lỗi khi tải tài liệu !' });
        }
    };

    getAllDocumentMetadataOfClass = async (req, res) => {
        try {
            const { classroomId } = req.body;
            const classroom = await Classroom.findById(classroomId, 'topicDocument')
                .populate({ path: 'topicDocument.documents', select: 'title createdAt fileAttributes' });

            if(!classroom || !classroom.topicDocument) {
                return res.status(200).json([]);
            }

            const topics = classroom.topicDocument;
            reverseTopicsOrder(topics);

            return res.status(200).json(topics);
        }
        catch (err) {
            console.error('Get All Metadata Error: ', err);
            res.status(400).json({ success: false, message: 'Không thể lấy danh sách tài liệu !' });
        }
    };

    changeDocument = async (req, res) => {
        try {
            const documentId = req.body.documentId;
            const title = req.body.title;
            const description = req.body.description;
            const topic = req.body.topic;

            const updatedDocument = await Document.findOne({ _id: documentId });
            if (!updatedDocument) {
                throw new Error('No document');
            }

            const classId = updatedDocument.classroomId;
            const oldTopic = updatedDocument.topic;

            var { duplicateTopicId, topics, isTheLastDocumentOfTopic } =
                await checkIfDuplicate(classId, oldTopic);
            const isTitleExist = checkIfDuplicateTitle(
                topics,
                title,
                documentId
            );
            if (isTitleExist) {
                throw new Error('2 documents have same title in 1 class');
            }

            // consider to erase this block of code
            if (!duplicateTopicId) {
                throw new Error('ERROR');
            }

            var topicId = getIdOfTopic(topics, topic);

            if (oldTopic != topic) {
                await changeTopic(
                    duplicateTopicId,
                    topicId,
                    topic,
                    documentId,
                    classId,
                    isTheLastDocumentOfTopic
                );
            }

            await Document.findOneAndUpdate(
                { _id: documentId },
                {
                    $set: {
                        title: title,
                        description: description,
                        topic: topic,
                    },
                }
            );
            return res
                .status(200)
                .json({
                    success: true,
                    message: 'Change document successfully',
                });
        } catch (err) {
            if (err.message == '2 documents have same title in 1 class') {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: '1 lớp không thể có 2 tài liệu cùng tên',
                    });
            } else if (err.message === 'No document') {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'Tài liệu không tồn tại hoặc đã bị xóa',
                    });
            } else {
                console.log(err);
                res.status(400).json({ success: false, message: 'ERROR' });
            }
        }
    };

    changeDocumentFile = async (req, res) => {
        try {
            const documentId = req.body.documentId;
            const file = req.file;
    
            const updatedDocument = await Document.findOne({ _id: documentId });
            if (!updatedDocument) {
                throw new Error('No document');
            }
    
            if (!file) {
                throw new Error('No file');
            }
    
            // Xóa file cũ trên Cloudinary (nếu có)
            const oldFilePath = updatedDocument.attachedFiles; // Đảm bảo bạn lưu trữ URL của file trong attachedFiles
            if (oldFilePath) {
                const publicId = oldFilePath.split('/').pop().split('.')[0]; // Lấy public_id từ URL
                await cloudinary.uploader.destroy(publicId); // Xóa file cũ
            }
    
            // Tải file lên Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(file.path, {
                folder: `documents/${documentId}`, // Tạo thư mục theo documentId
            });
    
            // Lấy URL và thông tin của file đã tải lên
            const fileUrl = uploadResponse.secure_url;
            const size = convertSizeToProperUnit(file.size);
            const extension = getFileExtension(file.filename);
            const fileAttribute = {
                name: file.filename,
                size: size,
                extension: extension,
            };
            const fileAttributes = [fileAttribute];
    
            // Cập nhật tài liệu với thông tin file mới
            await Document.updateOne(
                { _id: documentId },
                {
                    $set: {
                        attachedFiles: fileUrl,
                        fileAttributes: fileAttributes,
                    },
                }
            );
    
            // Xóa file tạm thời
            fs.emptyDir('uploads/');
    
            return res.status(200).json({
                success: true,
                message: 'Thay đổi file cho tài liệu thành công',
            });
        } catch (err) {
            if (err.message === 'No document') {
                return res.status(400).json({
                    success: false,
                    message: 'Tài liệu không tồn tại hoặc đã bị xóa',
                });
            } else if (err.message === 'No file') {
                return res.status(400).json({
                    success: true,
                    message: 'Bạn không gửi file nào cả',
                });
            } else {
                console.log(err);
                return res.status(400).json({ success: false, message: 'ERROR' });
            }
        }
    };

    eraseDocument = async (req, res) => {
        try {
            const documentId = req.body.documentId;
    
            const updatedDocument = await Document.findOne(
                { _id: documentId },
                'classroomId topic attachedFiles'
            );
            if (!updatedDocument) {
                throw new Error('No document');
            }
    
            const classroomId = updatedDocument.classroomId;
            const topic = updatedDocument.topic;
            const attachedFiles = updatedDocument.attachedFiles; // Lấy thông tin attachedFiles để xóa trên Cloudinary
    
            // Kiểm tra nếu tài liệu có liên kết với topic và classroom
            var { duplicateTopicId, topics, isTheLastDocumentOfTopic } =
                await checkIfDuplicate(classroomId, topic);
    
            // Xóa tài liệu khỏi topic
            await removeDocumentOutOfTopic(
                duplicateTopicId,
                documentId,
                classroomId,
                isTheLastDocumentOfTopic
            );
    
            // Xóa tài liệu trong cơ sở dữ liệu
            await Document.findOneAndDelete({ _id: documentId });
    
            // Xóa file khỏi Cloudinary nếu có
            if (attachedFiles) {
                const publicId = attachedFiles.split('/').pop().split('.')[0]; // Lấy public_id từ URL
                await cloudinary.uploader.destroy(publicId); // Xóa file trên Cloudinary
            }
    
            return res.status(200).json({ success: true, message: 'Xóa thành công' });
        } catch (err) {
            if (err.message === 'No document') {
                return res.status(400).json({
                    success: true,
                    message: 'Tài liệu không tồn tại hoặc đã bị xóa',
                });
            } else {
                console.log(err);
                return res.status(400).json({ success: true, message: 'Lỗi rồi' });
            }
        }
    };
}

module.exports = new DocumentController();
