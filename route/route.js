import express from "express";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { Post } from "../models/posts.models.js";
import { login } from "../controllers/login.js";
import { registor } from "../controllers/registor.js";
import { post } from "../controllers/post.js";
import { Status } from "../models/status.models.js";
import { profileUpdate } from "../controllers/UserUpdate.js";
import { profile } from "../controllers/profile.js";
import { addFriends } from "../controllers/addfriends.js";
import { postComment } from "../controllers/comments.js";
import { postLike } from "../controllers/postLike.js";
import { openprofile } from "../controllers/openprofile.js";
import { deleteFriendPermanet } from "../controllers/deletefriend.js";
import { EditProfile } from "../controllers/ProfileEdit.js";
import { ShareStatus } from "../controllers/status.js";
import { EditPost } from "../controllers/EditPost.js";
import { sendFriendRequest } from "../controllers/sendFriendRequest.js";
import { Notification } from "../models/Notification.models.js";


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
        const userId = req.user.userid; // Assuming req.user contains the logged-in user's details

        // Fetch the user along with notifications and populate sender details
        const user = await User.findById(userId)
            .populate({
                path: 'notifications',
                populate: {
                    path: 'sender',
                    select: 'name image',
                }
            })
            .exec();

        if (!user) {
            return res.redirect("/login");
        }

        // Fetch and populate posts and comments
        const posts = await Post.find()
            .populate({
                path: 'comments',
                populate: { path: 'user' }
            })
            .populate("user")
            .exec();

        // Fetch and filter statuses to show only one per user
        const allStatus = await Status.find().populate("user").exec();
        const uniqueStatus = [];
        const seenUsers = new Set();

        allStatus.forEach(status => {
            if (!seenUsers.has(status.user._id.toString())) {
                seenUsers.add(status.user._id.toString());
                uniqueStatus.push(status);
            }
        });

        // Filter valid posts and fetch all users
        const validPosts = posts.filter(post => post.user);
        const allUsers = await User.find();
        const allUserdata = allUsers.filter(u => u._id.toString() !== user._id.toString());
        const userPosts = await Post.find({ user: userId }).exec();
        const imageUrls = userPosts.map(post => post.image);
        const friends = await User.find({ _id: { $in: user.friends } }).exec();
        // Render the index page with the gathered data
        res.render("index", {
            user,
            posts: validPosts,
            allStatus: uniqueStatus,
            allUserdata,
            imageUrls,
            friends,
            allNotifications: user.notifications // Use the populated notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while loading the page.' });
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
router.get('/friend/remove/:id', isLoggedIn, deleteFriendPermanet);
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
router.get('/sent/friendRequest/:id', isLoggedIn, sendFriendRequest);

router.get('/delete/notification/:id', isLoggedIn, async (req, res) => {
    try {
        const notificationId = req.params.id;

        // Delete the notification from the Notification collection
        await Notification.findByIdAndDelete(notificationId);

        // Update the user's notifications list
        const user = await User.findById(req.user.userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove the notification ID from the user's notifications array
        user.notifications = user.notifications.filter(notifId => notifId.toString() !== notificationId);
        await user.save();
        // Send a response or redirect
        res.redirect("/"); // Adjust redirect as necessary
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting notification.' });
    }
});



