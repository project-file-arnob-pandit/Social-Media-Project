import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";

export const profile = async (req, res) => {

    const user = await User.findById(req.user.userid);
    if (!user) {
        return res.redirect("/login"); // Redirect to login if user is not found
    }
    const alluser = await User.find();
    const allUserdata = alluser.filter(u => u._id.toString() !== user._id.toString());

    const friends = await User.find({ _id: { $in: user.friends } });
    const userPosts = await Post.find({ user: req.user.userid });
    const imageUrls = userPosts.map(post => post.image);

    res.render("profile", { user, imageUrls, friends, allUserdata });
};
