const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

class CommentController {
    // Create new comment
    create = async (req, res) => {
        try {
            const { body } = req.body;
            const { classroomId, postId } = req.params;
            const userId = req.userId;
            
            if(!body?.trim()) {
                return res.status(400).json({ success: false, message: 'Nội dung comment không được để trống !' });
            }

            const newComment = new Comment({
                classroomId,
                postId,
                body,
                commentedBy: userId,
            });
            await newComment.save();

            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $push: { listComments: newComment._id } },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Comment thành công !',
                comment: newComment,
                post: updatedPost,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi server !' });
        }
    };

    // Update an existing comment
    update = async(req, res) => {
        try {
            const { body } = req.body;
            const { commentId } = req.params;
            const userId = req.userId;

            if(!body?.trim()) {
                return res.status(400).json({ success: false, message: 'Nội dung comment không được để trống !' });
            }

            const updatedComment = await Comment.findOneAndUpdate(
                { _id: commentId, commentedBy: userId },
                { body },
                { new: true }
            );

            if(!updatedComment) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy comment hoặc bạn không có quyền chỉnh sửa !' });
            }

            req.json({
                success: true,
                message: 'Cập nhật comment thành công !',
                comment: updatedComment,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi server !' });
        }
    };

    delete = async (req, res) => {
        try {
            const { postId, commentId } = req.params;
            const userId = req.userId;

            const deletedComment = await Comment.findOneAndDelete({
                _id: commentId,
                commentedBy: userId,
            });

            if(!deletedComment) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy comment hoặc bạn không có quyền xóa !' });
            }

            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $pull: { listComments: commentId } },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Xóa comment thành công !',
                comment: deletedComment,
                post: updatedPost,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi server !' });
        }
    };
}

module.exports = new CommentController();