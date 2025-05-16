import Playlist from "../models/playlist.model.js";
import Video from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { name, description } = req.body;

    const newPlaylist = await Playlist.create({
        name: name,
        description: description,
        videos: [],
        owner: userId
    });

    if (!newPlaylist) {
        throw new ApiError();
    }

    return res.status(201).json(new ApiResponse(201, newPlaylist, "Playlist created successfully."));
})

const removePlaylist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "playlistId is required");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    await playlist.deleteOne();
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist deleted successfully."));
})

const getMyPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const myPlaylists = await Playlist.find({ owner: userId });
    return res.status(200).json(
        new ApiResponse(200, myPlaylists, "Fetched playlists successfully.")
    );
})

const addToPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and Video ID are required.");
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or unauthorized.");
    }

    const videoExists = await Video.findById(videoId);

    if (!videoExists) {
        throw new ApiError(404, "Video not found.");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in the playlist.");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully.")
    );
})

const removeFromPlaylist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { videoId, playlistId } = req.params;
    if (!videoId || !playlistId) {
        throw new ApiError(400, "Both videoId and playlistId are required");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }

    playlist.videos = playlist.videos.filter(
        (v) => v.toString() !== videoId.toString()
    );
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully.")
    );
})

const accessPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required.");
    }
    const playlist = await Playlist.findById(playlistId).populate("videos");
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to access this playlist.");
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Here is your playlist."))
})

const changeNameOrDescription = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { playlistId } = req.params;
    const { newTitle, newDescription } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "playlistId is required");
    }

    if (!newTitle && !newDescription) {
        throw new ApiError(400, "At least one of newTitle or newDescription must be provided");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }

    if (newTitle) {
        playlist.title = newTitle;
    }
    if (newDescription) {
        playlist.description = newDescription;
    }

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "playlist updated successfully")
    );
})

export {
    createPlaylist,
    removePlaylist,
    getMyPlaylists,
    addToPlaylist,
    removeFromPlaylist,
    accessPlaylist,
    changeNameOrDescription
}