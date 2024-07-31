import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
export const registor = async (req, res) => {
    try {
        const { name, email, password, image } = req.body;
        // Check if user already exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const user = await User.create({ name, email, password: hashedPassword, image });
        // Generate token
        const token = jwt.sign({ email, userid: user._id }, "token");
        // Set token in cookie
        res.cookie("token", token);
        res.redirect(`/profile/edit/${user._id}`);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}