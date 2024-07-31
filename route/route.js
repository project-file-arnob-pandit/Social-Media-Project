import express from "express";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
import { login } from "../controllers/login.js";
import { registor } from "../controllers/registor.js";
import { post } from "../controllers/post.js";
import { Status } from "../models/status.models.js";
import { profileUpdate } from "../controllers/UserUpdate.js";
import { profile } from "../controllers/profile.js";
import { Comment } from "../models/comment.models.js";
import { addFriends } from "../controllers/addfriends.js";
import { postComment } from "../controllers/comments.js";
import { postLike } from "../controllers/postLike.js";
import { openprofile } from "../controllers/openprofile.js";
import { deletefriend } from "../controllers/deletefriend.js";
import { EditProfile } from "../controllers/ProfileEdit.js";
import { ShareStatus } from "../controllers/status.js";
import { EditPost } from "../controllers/EditPost.js";

export const router = express.Router();
// Middleware to protect routes
const isLoggedIn = (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect("/login");
    }
    try {
        const data = jwt.verify(req.cookies.token, "token");
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
};
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.userid).exec();
        if (!user) {
            return res.redirect("/login");
        }

        const posts = await Post.find()
            .populate({
                path: 'comments',
                populate: { path: 'user' }
            })
            .populate("user")
            .exec();

        const Allstatus = await Status.find().populate("user").exec();
        // Filter out statuses to show only one per user
        const uniqueStatus = [];
        const seenUsers = new Set();

        Allstatus.forEach(status => {
            if (!seenUsers.has(status.user._id.toString())) {
                seenUsers.add(status.user._id.toString());
                uniqueStatus.push(status);
            }
        });
        const validPosts = posts.filter(post => post.user);
        const allUsers = await User.find().exec();
        const allUserdata = allUsers.filter(u => u._id.toString() !== user._id.toString());
        const userPosts = await Post.find({ user: req.user.userid }).exec();
        const imageUrls = userPosts.map(post => post.image);
        const friends = await User.find({ _id: { $in: user.friends } }).exec();

        res.render("index", {
            user,
            posts: validPosts,
            Allstatus: uniqueStatus, // Use the filtered statuses
            allUserdata,
            imageUrls,
            friends
        });
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});
router.get("/post", isLoggedIn, (req, res) => {
    res.render("post");
});
router.get("/profile", isLoggedIn, profile);
router.get('/profile/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get("/status", isLoggedIn, (req, res) => {
    res.render("status");
});
router.get("/status/user/:id", isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        // Fetch the user along with their statuses
        const userStatus = await User.findById(id).populate('status');
        // Check if user exists
        if (!userStatus) {
            return res.status(404).send("User not found");
        }
        res.render("showStatus", { user: userStatus, statusImage: userStatus.status });
    } catch (error) {
        console.error("Error fetching user status:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get('/profile/edit/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    res.render('ProfileEdit', { user, id });
});
router.get('/post/edit/:id', async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    res.render('EditPost', { post });
});
router.post('/profile/edit/:id', isLoggedIn, EditProfile)
router.post('/post/edit/:id', isLoggedIn, EditPost)
router.post('/profile/update/:id', profileUpdate);
router.post("/status", isLoggedIn, ShareStatus);
router.post("/post", isLoggedIn, post);
router.get('/post/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Post.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {

    }
});
router.post('/register', registor);
router.post('/login', login);
router.get('/friend/:id', isLoggedIn, addFriends);
router.get('/friend/remove/:id', isLoggedIn, deletefriend);
router.post('/comment/:postId', isLoggedIn, postComment);
router.get("/like/:id", isLoggedIn, postLike);
router.get('/message', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.userid);
        res.render("message", { user })
    } catch (error) {
        res.status(500).send(error)
    }
});
router.get('/user/:id', isLoggedIn, openprofile);
router.get('/chat/:id', isLoggedIn, async (req, res) => {
    try {
        const token = req.cookies.token;
        const userId = req.params.id;
        const chatUser = await User.findById(userId);
        const loginUser = await User.findById(req.user.userid);
        const friends = await User.find({ _id: { $in: loginUser.friends } });
        res.render('chat', { loginUser, chatUser, friends, token });
    } catch (error) {
        res.status(500).send(error);
    }
});
