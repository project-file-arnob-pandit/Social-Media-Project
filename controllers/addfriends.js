import { User } from "../models/user.models.js";
import { Notification } from "../models/Notification.models.js";

export const addFriends = async (req, res) => {
    try {
        const friendId = req.params.id;
        const user = await User.findById(req.user.userid);

        if (!user) {
            return res.redirect("/login");
        }

        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).send("Friend not found");
        }

        // Add the friend to the sender's friends list if not already added
        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }

        // Add the sender to the friend's friends list if not already added
        if (!friend.friends.includes(user._id)) {
            friend.friends.push(user._id);
            await friend.save();
        }

        // Create a friend request notification
        const notification = await Notification.create({
            type: 'accept_request',
            content: 'accept request.',
            sender: user._id,
            receiver: friendId,
        });
        // Update the receiver's notifications
        friend.notifications.push(notification._id);
        await friend.save();

        res.redirect("/profile");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
