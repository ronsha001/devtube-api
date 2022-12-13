import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
  const userId = req.user.id;
  const newVideo = new Video({ userId: userId, ...req.body });

  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.id;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return next(createError(404, "Video not found"));
    }
    if (userId !== video.userId) {
      return next(createError(403, "You can update only your video"));
    }

    video.title = req.body.title;
    video.desc = req.body.desc;
    video.tags = req.body.tags.split(",");

    const updateVideo = await video.save();

    res.status(200).json(updateVideo);
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.id;
  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return next(createError(404, "Video not found"));
    }
    if (userId !== video.userId) {
      return next(createError(403, "You can delete only your video"));
    }

    await Video.findOneAndDelete({ _id: videoId });
    res.status(200).json("The video has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      return next(createError(404, "Video not found!"));
    }
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });

    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",").map((tag) => {
    return new RegExp(tag, "i");
  });
  const videoId = req.params.id;
  try {
    const videos = await Video.find({ tags: { $in: tags }, _id: { $nin: videoId } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tag = new RegExp(req.params.tag, "i");
  try {
    const videos = await Video.find({ tags: { $in: tag } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const myVideos = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const videos = await Video.find({ userId: userId });
    res.status(200).json({ videos });
  } catch (err) {
    next(err);
  }
};
