import { Router } from "express";
import {
    createComment,
    deleteComment,
    editComment,
    getComments,
    countComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a comment for a video
router.post("/comment/video/:videoId", verifyJWT, createComment);

// Delete a comment by commentId
router.delete("/comment/:commentId", verifyJWT, deleteComment);

// Edit a comment by commentId
router.patch("/comment/:commentId", verifyJWT, editComment);

// Get comments for a video with optional pagination params
// Example: /comments/video/123/page/2/limit/5
router.get(
    "/comments/video/:videoId/page/:page?/limit/:limit?",
    getComments
);

// Get total comment count for a video
router.get("/comments/video/:videoId/count", countComments);

export default router;
