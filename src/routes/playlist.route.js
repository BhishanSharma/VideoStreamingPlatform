import { Router } from "express";
import {
  createPlaylist,
  removePlaylist,
  getMyPlaylists,
  addToPlaylist,
  removeFromPlaylist,
  accessPlaylist,
  changeNameOrDescription,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new playlist (no params needed)
router.route("/playlist").post(verifyJWT, createPlaylist);

// Delete a playlist by playlistId (route param)
router.route("/playlist/:playlistId/delete").delete(verifyJWT, removePlaylist);

// Get all playlists owned by logged-in user
router.route("/playlists/my").get(verifyJWT, getMyPlaylists);

// Add video to playlist (playlistId and videoId as route params)
router.route("/playlist/:playlistId/add-video/:videoId").post(verifyJWT, addToPlaylist);

// Remove video from playlist (playlistId and videoId as route params)
router.route("/playlist/:playlistId/remove-video/:videoId").delete(verifyJWT, removeFromPlaylist);

// Access a playlist by playlistId (route param)
router.route("/playlist/:playlistId/access").get(verifyJWT, accessPlaylist);

// Change playlist name or description by playlistId (route param)
router.route("/playlist/:playlistId/update").patch(verifyJWT, changeNameOrDescription);

export default router;
