import { Request, Response } from "express";
import {
  getOne_LikeOrDislike_For_Video,
  LikeorDislike,
  Undo_LikeorDislike,
  getAll_LikeorDislike,
  getAll_LikeOrDislike_For_Video,
  User_LikeorDislike,
} from "../services/LikesandDislikes";
import logg from "../Logs/Customlog";

interface funcsType {
  code: number;
  message?: string;
  error?: string;
}

//types for getting all the videos a user has liked
interface userBodyAll {
  userId: string;
}
//types for getting, adding, deleting likes or dislikes on one video
interface userBody extends userBodyAll {
  videoRef: string;
  Ref?: string;
  type?: boolean;
  undo: boolean;
}

/* --- user --- */

//get one liked video
export const getOneLikedVideo = async (req: Request, res: Response) => {
  const { userId, Ref }: userBody = req.body;
  if (userId && Ref) {
    // get the data for one video on that user
    const { success, code, data, error } = await getOne_LikeOrDislike_For_Video(userId, Ref);

    if (success) return res.status(code).json({ status: code, data });
    //if things didnt go so well
    return res.status(code).json({ status: code, data, error });
  }
  //if the appropriate values were not provided
  return res
    .status(404)
    .json({ status: 404, error: `Provide the proper value for the following: (${Ref ? "" : "Ref,"} ${userId ? "" : "userId"})` });
};
//get liked videos
export const getLikedVideos = async (req: Request, res: Response) => {
  const { userId }: userBody = req.body;
  if (userId) {
    // get the data for one video on that user
    const { success, code, data, error } = await getAll_LikeOrDislike_For_Video(userId);

    if (success) return res.status(code).json({ status: code, data });
    //if things didnt go so well
    return res.status(code).json({ status: code, data, error });
  }
  //if the appropriate values were not provided
  return res.status(404).json({ status: 404, error: `Provide the proper value for the following: (${userId ? "" : "userId"})` });
};

/* ----------------------- */

/* --- videos --- */

//like/dislike video
export const LikeOrDislikeVideo = async (req: Request, res: Response) => {
  const {Ref, userId, type } = req.body;
  if (Ref && userId && typeof type === "boolean") {
    try {
      const { success, message, error, code, data } = await User_LikeorDislike(Ref, userId, type, "Video");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, message, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error, data,message });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${Ref ? "" : "Ref, "}${userId ? "" : "userId, "}${
      typeof type === "boolean" ? "" : "type"
    })`,
  });
};

//undo like/dislike video
export const Undo_LikeOrDislikeVideo = async (req: Request, res: Response) => {
  const { Ref, userId } = req.body;
  if (Ref && userId) {
    try {
      const { success, message, error, code, data } = await Undo_LikeorDislike(Ref, userId, "Video");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, message: message, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${Ref ? "" : "Ref, "}${userId ? "" : "userId"})`,
  });
};
/* ----------------------- */

/* --- comments --- */
//like / dislike comment
export const LikeOrDislikeComment = async (req: Request, res: Response) => {
  const { videoRef, Ref, userId, type } = req.body;
  if (videoRef && Ref && userId && typeof type === "boolean") {
    try {
      const { success, message, error, code, data } = await LikeorDislike(videoRef, Ref, userId, type, "Comment");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, message: message, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${videoRef ? "" : "videoRef, "}${Ref ? "" : "Ref, "}${userId ? "" : "userId, "}${
      typeof type === "boolean" ? "" : "type"
    })`,
  });
};
//undo like or dislike comment
export const Undo_LikeOrDislikeComment = async (req: Request, res: Response) => {
  const { Ref, userId } = req.body;
  if (Ref && userId) {
    try {
      const { success, message, error, code, data } = await Undo_LikeorDislike(Ref, userId, "Comment");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, message: message, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${Ref ? "" : "Ref, "}${userId ? "" : "userId"})`,
  });
};
//get all like/dislike comments for one video
export const Getall_LikeorDislikedComments = async (req: Request, res: Response) => {
  const { videoRef, userId } = req.body;
  if (videoRef && userId) {
    try {
      const { success, error, code, data } = await getAll_LikeorDislike(videoRef, userId, "Comment");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${videoRef ? "" : "videoRef, "}${userId ? "" : "userId, "})`,
  });
};

/* ----------------------- */

/* --- reply --- */
//like / dislike reply
export const LikeOrDislikereply = async (req: Request, res: Response) => {
  const { videoRef, Ref, userId, type } = req.body;
  if (videoRef && Ref && userId && typeof type === "boolean") {
    try {
      const { success, message, error, code, data } = await LikeorDislike(videoRef, Ref, userId, type, "Reply");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, message: message, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${videoRef ? "" : "videoRef, "}${Ref ? "" : "Ref, "}${userId ? "" : "userId, "}${
      typeof type === "boolean" ? "" : "type"
    })`,
  });
};
//undo like or dislike reply
export const Undo_LikeOrDislikereply = async (req: Request, res: Response) => {
  const { Ref, userId } = req.body;
  if (Ref && userId) {
    try {
      const { success, message, error, code, data } = await Undo_LikeorDislike(Ref, userId, "Reply");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, message: message, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${Ref ? "" : "Ref, "}${userId ? "" : "userId"})`,
  });
};
//get all like/dislike replys for one video
export const Getall_LikeorDislikedreplies = async (req: Request, res: Response) => {
  const { videoRef, userId } = req.body;
  if (videoRef && userId) {
    try {
      const { success, error, code, data } = await getAll_LikeorDislike(videoRef, userId, "Reply");
      //if everything went well
      if (success) {
        return res.status(code).json({ status: code, data });
      }
      //if something failed
      return res.status(code).json({ status: code, error });
    } catch (e: any) {
      logg.fatal(e.message);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${videoRef ? "" : "videoRef, "}${userId ? "" : "userId, "})`,
  });
};

/* ----------------------- */
