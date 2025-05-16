import Like from "../models/like.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { commentId, videoId, tweetId } = req.body;

    if (!commentId && !videoId && !tweetId) {
        throw new ApiError(400, "No target specified to like.");
    }

    const filter = {
        likedBy: userId,
        ...(commentId && { comment: commentId }),
        ...(videoId && { video: videoId }),
        ...(tweetId && { tweet: tweetId })
    };

    const exists = await Like.findOne(filter);
    if (exists) {
        throw new ApiError(400, "Already liked.");
    }

    const liked = await Like.create(filter);

    return res
        .status(200)
        .json(new ApiResponse(200, liked, "Content liked successfully."));
});

const removeLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { commentId, tweetId, videoId } = req.query;

    if (!commentId && !tweetId && !videoId) {
        throw new ApiError(400, "No target specified to remove like.");
    }

    const filter = {
        likedBy: userId,
        ...(commentId && { comment: commentId }),
        ...(tweetId && { tweet: tweetId }),
        ...(videoId && { video: videoId }),
    };

    const like = await Like.findOne(filter);

    if (!like) {
        throw new ApiError(404, "Like not found.");
    }

    await like.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Like removed successfully."));
});

const countLikes = asyncHandler(async (req, res) => {
    const { commentId, videoId, tweetId } = req.query;

    const filter = {
        ...(commentId && { comment: commentId }),
        ...(videoId && { video: videoId }),
        ...(tweetId && { tweet: tweetId })
    };

    if (!commentId && !videoId && !tweetId) {
        throw new ApiError(400, "No target specified.");
    }

    const totalLikes = await Like.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { totalLikes }, "Like count fetched.")
    );
});

export { 
    createLike, 
    removeLike, 
    countLikes, 
};