import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// export const update = async (req, res, next) => {
//   if (req.params.id === req.user.id) {
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       );

//       res.status(200).json(updatedUser);
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     return next(createError(403, "You can update only your account!"));
//   }
// };

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const subscribe = async (req, res, next) => {
  const userId = req.user.id;
  const channelId = req.params.id;
  try {
    await User.findByIdAndUpdate(userId, {
      $push: { subscribedUsers: channelId },
    });
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successful.");
  } catch (err) {
    next(err);
  }
};
export const unsubscribe = async (req, res, next) => {
  const userId = req.user.id;
  const channelId = req.params.id;
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { subscribedUsers: channelId },
    });
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unsubscription successful.");
  } catch (err) {
    next(err);
  }
};
export const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res.status(200).json("The video has been liked.");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const imgUrl = req.body.imgUrl;
  const userId = req.params.id;
  console.log(req.body)
  if (!userId) {
    const error = new Error();
    error.status = 404;
    error.message = "User id not found.";
    throw error;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error();
      error.status = 404;
      error.message = "User not found.";
      throw error;
    }
    if (name?.length > 0) {
      user.name = name;
    }
    if (email?.length > 0) {
      user.email = email;
    }
    if (imgUrl?.length > 0) {
      user.img = imgUrl;
    }
    const updatedUser = await user.save();
    const { password, ...updatedUserWithoutPW} = updatedUser._doc

    return res
      .status(200)
      .json(updatedUserWithoutPW);
  } catch (err) {
    next(err);
  }
};
