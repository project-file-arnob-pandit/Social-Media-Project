import { Schema, model } from "mongoose";

const CommentSechma = Schema({
    comment: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export const Comment = model("Comment", CommentSechma)