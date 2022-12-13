import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getByTag,
  getByTags,
  getVideo,
  myVideos,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/video.js";

import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// CREATE A VIDEO
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/my-videos/:id", verifyToken, myVideos);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/search", search);
router.get("/:id/tags", getByTags);
router.get("/:tag", getByTag);

export default router;
