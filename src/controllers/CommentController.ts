import { Request, Response } from "express";
import logg from "../Logs/Customlog";
import {
  getComments,
  addComment,
  getCommentsTypes,
  findCommentAmount,
  addReqTypes,
  addReply,
  deleteOneComment,
  deleteOneReply,
} from "../services/Comment";

//get comments in batch
export const AllComments = async (req: Request, res: Response) => {
  const { prevId, videoRef }: getCommentsTypes = req.body;

  //check if the videoRef is provided and if its a string
  if (videoRef) {
    try {
      //take in the previous/last element value and use it to paginate
      const { success, data, code, error } = await getComments({ videoRef, prevId });
      if (success) {
        //if everything goes softly
        return res.status(200).json({ status: code, data });
      }
      // else return an error and its message
      return res.status(code).json({ status: code, data: "", error });
    } catch (error) {
      // else return an error and its message
      logg.warn(`Error while getting comment`);
      return res.status(404).json({ status: 404, error: "Something went wrong, try again" });
    }
  }
  //if its not provided
  return res.status(404).json({ status: 404, error: "Provide the proper value for the property: ( videoRef )" });
};

//find total comment for a video
export const TotalComments = async (req: Request, res: Response) => {
  const { videoRef }: { videoRef: string } = req.body;

  //check if the videoRef is provided
  if (videoRef) {
    //take in the videoref id and use it the query the db through the function `findcommentammount`
    const { success, data, code, error } = await findCommentAmount({ videoRef });
    try {
      if (success) {
        return res.status(code).json({ status: code, data });
      }
      return res.status(code).json({ status: code, data: "", error });
    } catch (error) {
      logg.warn(`Error while getting total comment`);
      return res.status(404).json({ status: 404, error: "Something went wrong, try again" });
    }
  }
  return res.status(404).json({ status: 404, error: "Provide the proper value for the following: ( videoRef )" });
};

//add a new comment
export const AddNewComment = async (req: Request, res: Response) => {
  const { userId, videoRef, text, channelId }: addReqTypes = req.body;

  //check if the data in req.body is valid
  if (videoRef && text && (userId || channelId)) {
    try {
      const { success, code, error, data } = await addComment({ userId, videoRef, text, channelId });
      //if the add process was successful then
      if (success) {
        logg.info(`Comment added successfully`);
        return res.status(200).json({ status: 200, message: "Comment added successfully", data });
      }
      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e) {
      //if Something went wrong
      logg.warn(`Error while adding comment`);
      return res.status(404).json({ error: `something went wrong, try again` });
    }
  }
  // else
  return res
    .status(404)
    .json({ status: 404, error: "Provide the proper value for the following: ( userId || channelId, videoRef & text )" });
};

//add reply to a comment
export const AddReplyToComment = async (req: Request, res: Response) => {
  const { commentRef, userId, text, channelId, videoRef }: addReqTypes = req.body;
  //check if the data in req.body is valid

  if (commentRef && videoRef && (userId || channelId) && text) {
    try {
      const { success, code, error,data } = await addReply({ userId, channelId, commentRef, text, videoRef });

      if (success) return res.status(code).json({ status: code, data, message: `Reply added successfully` });

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e) {
      //if Something went wrong
      logg.warn(`Error while adding reply to comment`);
      return res.status(404).json({ status: 404, error: `something went wrong, try again` });
    }
  }
  // else
  return res
    .status(404)
    .json({ status: 404, error: "Provide the proper value for the following: ( commentRef, ( userId or channelId), videoRef & text )" });
};

//delete comment
export const DeleteComment = async (req: Request, res: Response) => {
  const { commentId, id, idType }: { commentId: string; idType: string; id: string } = req.body;
  const idTypeCheck = idType === "user" || idType === "channel"

  if (commentId  && idTypeCheck && id) {
    try {
      const { success, code, error } = await deleteOneComment(commentId,idType, id);
      if (success) return res.status(code).json({ status: code, data: "", message: `comment deleted successfully` });

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e) {
      //if Something went wrong
      logg.warn(`Error while adding deleting comment`);
      return res.status(404).json({ error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({ error: "Provide the proper value for the following: (commentId, id and idType)" });
};
//delete reply
export const DeleteReply = async (req: Request, res: Response) => {
  const { replyId, id, idType }: { replyId: string; idType: string; id: string } = req.body;
  const idTypeCheck = idType === "user" || idType === "channel"
  if (replyId && idTypeCheck && id) {
    try {
      const { success, code, error } = await deleteOneReply(replyId, idType, id);
      if (success) return res.status(code).json({ status: code, data: "", message: `Reply deleted successfully` });

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e) {
      //if Something went wrong
      logg.warn(`Error while adding deleting reply`);
      return res.status(404).json({ error: `something went wrong, try again` });
    }
  }
  //if the appropriate values were not provided
  return res.status(404).json({ error: "Provide the proper value for the following: (replyId, id and idType)" });
};
