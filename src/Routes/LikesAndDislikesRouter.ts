import { Router } from "express";
import {
  getLikedVideos,
  LikeOrDislikeComment,
  Undo_LikeOrDislikeComment,
  Getall_LikeorDislikedComments,
  LikeOrDislikereply,
  Undo_LikeOrDislikereply,
  Getall_LikeorDislikedreplies,
  LikeOrDislikeVideo,
  Undo_LikeOrDislikeVideo,
  getOneLikedVideo,
} from "../controllers/LikeController";
//just to shorten things r=== router in this case and a lot of cases
const r = Router();

/* --- for user --- */
r.post("/user", getLikedVideos); //route to get all liked videos

/* ---for videos--- */
r.post("/video", LikeOrDislikeVideo); // route to like/ dislike for a video
r.post("/video/undo", Undo_LikeOrDislikeVideo); //route to undo like / dislike
r.post("/video/user", getOneLikedVideo); //route to like/dislike of one user status for a video

/* --- for comments --- */
r.post("/comment", LikeOrDislikeComment); //route to like/ dislike for a comment
r.post("/comment/undo", Undo_LikeOrDislikeComment); //route to undo dislike/ like for a comment
r.post("/comment/user", Getall_LikeorDislikedComments); //route to like/dislike of one user status for a comment

/* --- for reply --- */
//the same system for comments
r.post("/reply", LikeOrDislikereply);
r.post("/reply/undo", Undo_LikeOrDislikereply);
r.post("/reply/user", Getall_LikeorDislikedreplies); //route to like/dislike of one user status for a reply

export default r;
