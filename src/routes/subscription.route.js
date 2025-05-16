import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getMySubscriptions,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Subscribe to a channel (channel id in route param)
router.route("/:channelId").post(verifyJWT, subscribe);

// Unsubscribe from a channel (channel id in route param)
router.route("/:channelId").delete(verifyJWT, unsubscribe);

// Get list of channels the user is subscribed to
router.route("/my").get(verifyJWT, getMySubscriptions);

export default router;
