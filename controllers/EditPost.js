import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
export const EditPost = async (req, res) => {
    const id = req.params.id;
    const { image, caption } = req.body;
    const Editpost = await Post.findByIdAndUpdate(id, { image, caption }, { new: true });
    await Editpost.save();
    // console.log(updateUser);
    res.redirect('/');
}