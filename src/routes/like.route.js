import { Router } from "express";
import { createLike, removeLike, countLikes } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Like a comment
router.post("/like/comment/:commentId", verifyJWT, createLike);

// Like a video
router.post("/like/video/:videoId", verifyJWT, createLike);

// Like a tweet
router.post("/like/tweet/:tweetId", verifyJWT, createLike);

// Remove like from comment
router.delete("/like/comment/:commentId", verifyJWT, removeLike);

// Remove like from video
router.delete("/like/video/:videoId", verifyJWT, removeLike);

// Remove like from tweet
router.delete("/like/tweet/:tweetId", verifyJWT, removeLike);

// Get like count for comment
router.get("/like/comment/:commentId/count", countLikes);

// Get like count for video
router.get("/like/video/:videoId/count", countLikes);

// Get like count for tweet
router.get("/like/tweet/:tweetId/count", countLikes);

export default router;
