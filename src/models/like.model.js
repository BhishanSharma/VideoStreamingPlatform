import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    tweet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

// Allow only one of comment, video, or tweet
likeSchema.pre("validate", function (next) {
  const targets = [this.comment, this.video, this.tweet].filter(Boolean);
  if (targets.length !== 1) {
    return next(new Error("Like must be associated with exactly one target."));
  }
  next();
});

export const Like = mongoose.model("Like", likeSchema);
