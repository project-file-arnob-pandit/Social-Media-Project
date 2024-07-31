import { User } from "../models/user.models.js";
import { Post } from "../models/posts.models.js";
export const addFriends = async (req, res) => {
    try {
        // Extract friend's ID from request parameters
        const friendId = req.params.id;
        // Retrieve logged-in user's information
        const user = await User.findById(req.user.userid);
        // console.log("current logged-in user data", user);
        if (!user) {
            // Redirect to login page if user is not found
            return res.redirect("/login");
        }
        // Check if the friend is already in the user's friends list
        if (user.friends.includes(friendId)) {
            // If friend is already in the list, redirect back with a message
            return res.redirect("/");
        }
        // Add friend to user's friend list
        user.friends.push(friendId);
        await user.save();
        res.redirect("/profile");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}