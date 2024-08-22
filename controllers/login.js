
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("Incorrect password");
        }
        // Generate token
        const token = jwt.sign({ email, userid: user._id }, "token");
        // Set token in cookie
        res.cookie("token", token);
        res.redirect("/");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}