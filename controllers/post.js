import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
export const post = async (req, res) => {
    try {
        const { caption, image } = req.body;
        // Find the user who is creating the post
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Create a new post and associate it with the user
        const post = new Post({
            caption,
            image,
            user: user._id
        });
        await post.save();
        user.posts.push(post._id);
        await user.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Internal Server Error");
    }
}