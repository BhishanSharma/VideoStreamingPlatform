import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    const videoFileLocalPath = req.files?.video?.[0]?.path;
    const thumbnailFileLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath || !thumbnailFileLocalPath) {
      return res
        .status(400)
        .json({ success: false, message: "Video and thumbnail are required" });
    }

    const video = await uploadVideoOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadVideoOnCloudinary(thumbnailFileLocalPath);

    if (!video || !thumbnail) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload video or thumbnail",
      });
    }

    const user_id = req.user._id;

    const newVideo = await Video.create({
      video: video.secure_url,
      thumbnail: thumbnail.secure_url,
      title,
      description,
      duration: video.duration,
      owner: user_id,
    });

    const createdVideo = await Video.findById(newVideo._id);

    if (!createdVideo) {
      throw new ApiError(500, "Something went wrong while uploading video.");
    }

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        _id: createdVideo._id,
        title: createdVideo.title,
        video_url: createdVideo.video,
        thumbnail_url: createdVideo.thumbnail,
        hls_stream_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/sp_hls/${video.public_id}.m3u8`,
      },
    });
  } catch (error) {
    console.error("Upload Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

function extractPublicId(url) {
  const parts = url.split("/");
  const filename = parts.pop().split(".")[0];
  const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
  return folder ? `${folder}/${filename}` : filename;
}

const getStreamingUrl = async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({ success: false, message: "Video not found" });
  }

  const publicId = extractPublicId(video.video);

  const hlsUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/sp_hls/${publicId}.m3u8`;

  return res.status(200).json({
    success: true,
    hls_stream_url: hlsUrl,
    thumbnail_url: video.thumbnail,
    title: video.title,
    description: video.description,
    duration: video.duration,
  });
};

const removeVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { videoId } = req.query;

  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }
  const videoPublicId = extractPublicId(video.video);
  const thumbnailPublicId = extractPublicId(video.thumbnail);
  await video.deleteOne();
  await deleteFromCloudinary(videoPublicId, "video");
  await deleteFromCloudinary(thumbnailPublicId, "image");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully."));
});

const getMyVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, videos, "Here are your videos."))
});

const getVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.query;

  const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, videos, "Here are your videos."))
})

const changeTitleOrDescription = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { videoId } = req.query;
  const { newTitle, newDescription } = req.body;

  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }

  if (!newTitle && !newDescription) {
    throw new ApiError(400, "At least one of newTitle or newDescription must be provided");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  if (newTitle) {
    video.title = newTitle;
  }
  if (newDescription) {
    video.description = newDescription;
  }

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  );
});

export { uploadVideo, getStreamingUrl, getMyVideos, getVideos, removeVideo, changeTitleOrDescription };
