import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Tweet = mongoose.model("Tweet", tweetSchema);
