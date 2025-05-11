const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const Post = new Schema({
    classroomId: {
        type: ObjectId,
        ref: 'Classroom',
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    listComments: [{
        type: ObjectId,
        ref: 'Comment',
    }],
    postedBy: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', Post);