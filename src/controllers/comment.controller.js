import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { videoId } = req.query;
  const { content } = req.body;

  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }
  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  const newComment = await Comment.create({
    video: videoId,
    content,
    owner: userId
  });

  if (!newComment) {
    throw new ApiError(500, "Failed to create comment");
  }

  return res.status(201).json(
    new ApiResponse(201, newComment, "Comment created successfully")
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.body;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Comment deleted successfully")
  );
});

const editComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.query;
  const { newComment } = req.body;

  if (!commentId) {
    throw new ApiError(400, "commentId is required");
  }

  if (!newComment) {
    throw new ApiError(400, "New comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to edit this comment");
  }

  comment.content = newComment;
  comment.edited = true;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const { videoId } = req.query;
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;

  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }

  const result = await Comment.paginate(
    { video: videoId },
    { page, limit, sort: { createdAt: -1 }, populate: "owner" } // add populate if you want user info
  );

  return res.status(200).json(
    new ApiResponse(200, {
      comments: result.docs,
      pagination: {
        total: result.totalDocs,
        page: result.page,
        limit: result.limit,
        pages: result.totalPages,
      },
    }, "Comments fetched successfully")
  );
});

const countComments = asyncHandler(async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }
  const count = await Comment.countDocuments({ video: videoId });
  return res.status(200).json(new ApiResponse(200, { totalComments: count }, "Here is the number of comments."))
})

export { createComment, deleteComment, editComment, getComments, countComments };
