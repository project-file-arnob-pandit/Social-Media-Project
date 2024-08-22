import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
export const EditProfile = async (req, res) => {
    const id = req.params.id;
    const { image, coverimage, intro, about } = req.body;
    const Edit = await User.findByIdAndUpdate(id, { image, coverimage, intro, about }, { new: true });
    await Edit.save();
    // console.log(updateUser);
    res.redirect('/');
}