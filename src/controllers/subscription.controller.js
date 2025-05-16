import Subscription from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const subscribe = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { channel } = req.body;
    
    if (!channel) {
        throw new ApiError(400, "Channel ID is required.");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channel
    });

    if (existingSubscription) {
        throw new ApiError(400, "Already subscribed to this channel.");
    }

    const newSubscription = await Subscription.create({
        subscriber: userId,
        channel: channel
    });

    if (!newSubscription) {
        throw new ApiError("error subscribing the channel.");
    }

    return res.status(201).json(new ApiResponse(201, newSubscription, "subscribed sucessfully."));
})

const unsubscribe = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { channel } = req.body;

    if (!channel) {
        throw new ApiError(400, "Channel ID is required.");
    }

    const deleted = await Subscription.findOneAndDelete({
        subscriber: userId,
        channel: channel
    });

    if (!deleted) {
        throw new ApiError(404, "Subscription not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Unsubscribed successfully.")
    );
});

const getMySubscriptions = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const subscriptions = await Subscription.find({ subscriber: userId })
        .populate("channel")
        .exec();

    return res.status(200).json(
        new ApiResponse(200, subscriptions, "Fetched subscribed channels successfully.")
    );
});

export {
    subscribe,
    unsubscribe,
    getMySubscriptions
}