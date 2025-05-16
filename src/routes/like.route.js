import { Router } from "express";
import { createLike, removeLike, countLikes } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Like a comment
router.post("/comment/:commentId", verifyJWT, createLike);

// Like a video
router.post("/video/:videoId", verifyJWT, createLike);

// Like a tweet
router.post("/tweet/:tweetId", verifyJWT, createLike);

// Remove like from comment
router.delete("/comment/:commentId", verifyJWT, removeLike);

// Remove like from video
router.delete("/video/:videoId", verifyJWT, removeLike);

// Remove like from tweet
router.delete("/tweet/:tweetId", verifyJWT, removeLike);

// Get like count for comment
router.get("/comment/:commentId/count", countLikes);

// Get like count for video
router.get("/video/:videoId/count", countLikes);

// Get like count for tweet
router.get("/tweet/:tweetId/count", countLikes);

export default router;
