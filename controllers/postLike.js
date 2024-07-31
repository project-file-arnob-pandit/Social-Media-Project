import { User } from "../models/user.models.js";
import { Post } from "../models/posts.models.js";
import { Comment } from "../models/comment.models.js";
export const postLike = async (req, res) => {

    try {
        // Find the post by ID and populate the user field
        const post = await Post.findOne({ _id: req.params.id }).populate("user");
        // Check if the current user has already liked the post
        const userLikedIndex = post.likes.indexOf(req.user.userid);
        if (userLikedIndex === -1) {
            // If the user hasn't liked the post, add their user ID to the likes array
            post.likes.push(req.user.userid);
        } else {
            // If the user has already liked the post, remove their user ID from the likes array
            post.likes.splice(userLikedIndex, 1);
        }
        // Save the updated post with the new likes array
        await post.save();
        // Redirect back to the profile page after liking/unliking the post
        res.redirect("/");
    } catch (error) {

        res.status(500).send("Internal Server Error");
    }
}