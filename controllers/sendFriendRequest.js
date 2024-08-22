import { Notification } from "../models/Notification.models.js";
import { User } from "../models/user.models.js";

export const sendFriendRequest = async (req, res) => {
    try {
        // current user sent request
        const senderId = req.user.userid;
        // receive this sent request user
        const receiverId = req.params.id;
        // Validate sender and receiver
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Create the friend request notification
        const notification = await Notification.create({
            type: 'friend_request',
            content: 'Sent friend request.',
            sender: senderId,
            receiver: receiverId,
        });
        // Update the receiver's notifications
        await User.findByIdAndUpdate(
            receiverId,
            { $push: { notifications: notification._id } },
            { new: true }
        );
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending the friend request.' });
    }
};
