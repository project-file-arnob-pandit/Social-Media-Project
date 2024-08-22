import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    type: String,
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Add other fields as needed
}, {
    timestamps: true
});

export const Notification = mongoose.model('Notification', NotificationSchema);
