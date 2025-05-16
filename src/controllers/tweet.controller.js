import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { content } = req.body;
  const newTweet = await Tweet.create({
    content: content,
    owner: userId
  })
  const uploadedTweet = await Tweet.findOne({ owner: newTweet._id });
  if (!uploadedTweet) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }
  return res.status(201).json(new ApiResponse(200, uploadedTweet, "Tweet uploaded sucessfully"));
});

const removeTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "tweetId is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this tweet");
  }

  await tweet.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "deleted successfully"));
})

const editTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { tweetId } = req.params;
  const { newTweet } = req.body;

  if (!tweetId) {
    throw new ApiError(400, "tweetId is required");
  }

  if (!newTweet) {
    throw new ApiError(400, "New tweet content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to edit this tweet");
  }

  tweet.content = newTweet;
  tweet.edited = true;
  await tweet.save();

  return res.status(200).json(
    new ApiResponse(200, tweet, "Tweet updated successfully")
  );
});

const myTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const Tweets = await Tweet.find({ owner: userId });
  if (!Tweets) {
    return res.status(200).json(new ApiResponse(200, Tweets, "There are no tweets from you."));
  }
  return res.status(200).json(new ApiResponse(200, Tweets, "Tweets fetched successfully."));
})

export {
  createTweet,
  removeTweet,
  editTweet,
  myTweets
}