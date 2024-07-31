import { User } from "../models/user.models.js"; // Adjust path as per your project structure

export const deletefriend = async (req, res) => {
    try {
        // Extract friend's ID from request parameters
        const friendId = req.params.id;
        // Retrieve logged-in user's information
        const userId = req.user.userid; // Assuming you have the user's ID in req.user.userid
        const user = await User.findById(userId);
        if (!user) {
            // Redirect to login page if user is not found
            return res.redirect("/login");
        }
        // Filter out the friend's ID from the user's friends list
        user.friends = user.friends.filter(f => f.toString() !== friendId);
        await user.save();
        // Optionally, you can remove the current user from the friend's list as well
        // const friend = await User.findById(friendId);
        // if (friend) {
        //     friend.friends = friend.friends.filter(f => f.toString() !== userId);
        //     await friend.save();
        // }
        // Redirect to homepage or another appropriate page after deleting friend
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
