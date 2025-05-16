import { Router } from "express";
import {
  createTweet,
  removeTweet,
  editTweet,
  myTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new tweet
router.route("/tweet").post(verifyJWT, createTweet);

// Delete a tweet by tweetId (query param)
router.route("/tweet/:tweetId/delete").delete(verifyJWT, removeTweet);

// Edit a tweet by tweetId (query param)
router.route("/tweet/:tweetId/edit").patch(verifyJWT, editTweet);

// Get all tweets by logged in user
router.route("/tweets/my").get(verifyJWT, myTweets);

export default router;
