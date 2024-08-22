import { Schema, model } from "mongoose";

const PostSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: String,
    date: {
        type: Date,
        default: Date.now
    },
    caption: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
})

export const Post = model("Post", PostSchema)