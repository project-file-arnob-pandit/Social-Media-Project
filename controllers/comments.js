import { User } from "../models/user.models.js";
import { Post } from "../models/posts.models.js";
import { Comment } from "../models/comment.models.js";
export const postComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { comment } = req.body;
        const commentUser = await User.findById(req.user.userid);
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const newComment = new Comment({
            comment,
            user: commentUser._id,
            postId
        });
        await newComment.save();
        // Push the entire newComment object into the comments array of the post
        post.comments.push(newComment._id);
        await post.save();
        res.redirect(`/`);
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
}