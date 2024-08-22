import { User } from "../models/user.models.js"; // Adjust path as per your project structure

export const deleteFriendPermanet = async (req, res) => {
    try {
        // Extract friend's ID from request parameters
        const friendId = req.params.id;
        if (!friendId) {
            return res.status(400).json({ message: "Friend ID is required" });
        }

        // Retrieve logged-in user's information
        const userId = req.user.userid;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user and the friend in the database
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        // Check if both user and friend exist
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        // Ensure user.friends is not null
        if (!user.friends) {
            return res.status(400).json({ message: "User friends list is empty or undefined" });
        }

        // Filter out the friend's ID from the user's friends list
        user.friends = user.friends.filter(f => f && f.toString() !== friendId.toString());

        // Save the updated user document
        await user.save();

        // Optionally, you might want to delete the friend from the database
        // await User.findByIdAndDelete(friendId);

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};