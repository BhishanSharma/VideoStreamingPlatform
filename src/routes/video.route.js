import { Router } from "express";
import {
  uploadVideo,
  getStreamingUrl,
  getVideos,
  removeVideo,
  changeTitleOrDescription,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload/video").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router.route("/video/:videoId/delete").delete(verifyJWT, removeVideo);

router.route("/video/:videoId/update").patch(verifyJWT, changeTitleOrDescription);

router.route("/video/:id/stream").get(getStreamingUrl);

router.route("/channel/:channelId/videos").get(getVideos);

export default router;
