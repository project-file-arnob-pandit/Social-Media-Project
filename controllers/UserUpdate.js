import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
export const profileUpdate = async (req, res) => {
    const id = req.params.id;
    const { image, coverimage, intro, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(id, { image, coverimage, intro, about }, { new: true });
    await updateUser.save();
    // console.log(updateUser);
    res.redirect('/');
}