import { Schema, model } from "mongoose";

const StatusSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: String,
    music: String, // Optional: URL or path for music
    caption: String, // Optional: Text caption for the status
    date: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date, // Optional: Automatically set an expiry date
        default: function () {
            const date = new Date();
            date.setHours(date.getHours() + 24); // Status expires in 24 hours
            return date;
        }
    },
    reaction: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});

export const Status = model("Status", StatusSchema);
