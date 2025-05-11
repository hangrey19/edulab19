const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const Comment = new Schema({
    classroomId: {
        type: ObjectId,
        ref: 'Classroom',
    },
    postId: {
        type: ObjectId,
        ref: 'Post',
    },
    commentedBy: {
        type: ObjectId,
        ref: 'User',
    },
    body: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', Comment);