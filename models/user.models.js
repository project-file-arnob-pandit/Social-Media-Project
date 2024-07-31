import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
    },
    coverimage: {
        type: String,
    },
    intro: {
        type: String,
    },
    about: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    status: [
        {
            type: Schema.Types.ObjectId,
            ref: "Status"
        }
    ],
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const User = model("User", UserSchema);
