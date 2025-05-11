const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ']
    },
    avatarUrl: {
        type: String,
    },
    ifHasAvatar: {
        type: Boolean,
        default: false,
    },
    classStudent: [{
        type: ObjectId,
        ref: 'Classroom',
    }],
    classTeacher: [{
        type: ObjectId,
        ref: 'Classroom',
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);