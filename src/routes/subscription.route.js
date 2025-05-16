import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getMySubscriptions,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Subscribe to a channel (channel id in route param)
router.route("/subscribe/:channelId").post(verifyJWT, subscribe);

// Unsubscribe from a channel (channel id in route param)
router.route("/unsubscribe/:channelId").delete(verifyJWT, unsubscribe);

// Get list of channels the user is subscribed to
router.route("/subscriptions/my").get(verifyJWT, getMySubscriptions);

export default router;
