const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const Classroom = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
    },
    listPost: [{
        type: ObjectId,
        ref: 'Post',
        default: [],
    }],
    teacherId: {
        type: ObjectId,
        ref: 'User',
    },
    listStudent: [{
        type: ObjectId,
        ref: "User",
        default: [],
    }],
    numberOfMember: {
        type: Number,
        default: 0,
    },
    topicDocument: [{
        topic: {
            type: String
        },
        documents: [{
            type: ObjectId,
            ref: 'Document',
        }],
        default: [],
    }],
    topicHomework: [{
        topic: {
            type: String
        },
        homeworks: [{
            type: ObjectId,
            ref: 'Homework',
        }],
        default: [],
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Classroom', Classroom);