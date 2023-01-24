import { Reply, Comment } from "../models";
import logg from "../Logs/Customlog";
import { ObjectId } from "mongodb";
import { ObjectId as ObjectID } from "mongoose";
import { commentsType, ResultTypes } from "../types/main";
import { doesVideoExist } from "../utils";

//types for the function that will add comments
interface addCommentTypes {
  userId: string | null;
  channelId: string | null;
  videoRef: string;
  text: string;
}
//types for the function to get all/some comments
export interface getCommentsTypes {
  videoRef: string;
  prevId: string;
}

//types for the function to add reply
export interface addReqTypes {
  commentRef: string;
  userId: string;
  channelId: string;
  text: string;
  videoRef: string;
}

//types for the main data returned from mongodb
interface getCommentResponseChild extends commentsType {
  _id: ObjectID;
}
//types for the final comment response
interface getCommentsResult {
  success: boolean;
  // data?: getCommentResponseChild[];
  data?: any;
}

//paignation default values
const perPagination: number = 30;
//function to add comments
export const addComment = async ({ userId, channelId, videoRef, text }: addCommentTypes): Promise<ResultTypes> => {
  //add comment
  try {
    const doesExist = await doesVideoExist(videoRef);
    if (!doesExist) {
      //if video doesnt exist
      return {
        success: false,
        message: "Video does not exist",
        code: 404,
      };
    }
    const comment = new Comment({
      user: userId,
      channel: channelId,
      videoRef,
      text,
    });
    //save the comment
    const data = await comment.save();
    const user = await data?.user;
    const channel = await data?.channel;
    if (user) {
      await data.populate("user", { _id: 1, profilePic: 1, username: 1 });
    }
    if (channel) {
      await data.populate("channel", { _id: 1, channelPic: 1, channelName: 1, username: 1 });
    }
    //if everything goes well, return...
    return { success: true, code: 200, data };
  } catch (e: any) {
    //if everything doesn't go well, return...
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//function to add reply to a comment
export const addReply = async ({ commentRef, videoRef, channelId, userId, text }: addReqTypes): Promise<ResultTypes> => {
  try {
    const doesExist = await doesVideoExist(videoRef);
    if (!doesExist) {
      //if video doesnt exist
      return {
        success: false,
        message: "Video does not exist",
        code: 404,
      };
    }

    //add reply
    const reply = new Reply({
      user: userId,
      channel: channelId,
      commentRef,
      text,
      videoRef,
    });
    //save the reply
    const data = await reply.save();
    const user = await data?.user;
    const channel = await data?.channel;
    if (user) {
      await data.populate("user", { _id: 1, profilePic: 1, username: 1 });
    }
    if (channel) {
      await data.populate("channel", { _id: 1, channelPic: 1, channelName: 1, username: 1 });
    }
    const newReply = new ObjectId(data._id);
    //add the reference in the comment document
    const result = await Comment.findOneAndUpdate({ _id: commentRef }, { $push: { replies: [newReply] } });
    // if id was found
    if (result) return { success: true, code: 200, data };
    //if the id was not found
    return { success: false, code: 404, error: "Something odd happened, kindly check your side before you again" };
    //if everything goes well, return...
  } catch (e: any) {
    logg.fatal(e.message);
    //if everything doesn't go well, return...
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//function to get all comments
export const getComments = async ({ videoRef, prevId }: getCommentsTypes): Promise<ResultTypes> => {
  try {
    // if prev id was provided, then we paginate
    if (prevId) {
      const id = new ObjectId(prevId);
      const data = await Comment.find({ videoRef, _id: { $gt: id } })
        .populate("user", { _id: 1, profilePic: 1, username: 1 }) // populate users if its a user who commented
        .populate("channel", { _id: 1, channelPic: 1, channelName: 1 }) //populate channel if its a channel who commented
        .populate("replies", "-__v") //exclude `__v` in populating replies
        .populate({
          path: "replies",
          populate: { path: "channel user", select: { _id: 1, channelPic: 1, channelName: 1, profilePic: 1, username: 1 } },
        }) // populate replies users if its a user who replied</ResultTypes>
        .sort("createdAt")
        .limit(perPagination);
      return { success: true, code: 200, data };
    }
    // else, return the initial
    const data = await Comment.find({ videoRef })
      .populate("replies", "-__v") //exclude `__v` in populating replies
      .populate("user", { _id: 1, profilePic: 1, username: 1 }) // populate users if its a user who commented
      .populate("channel", { _id: 1, channelPic: 1, channelName: 1 }) //populate channel if its a channel who commented
      .populate({
        path: "replies",
        populate: { path: "channel user", select: { _id: 1, channelPic: 1, channelName: 1, profilePic: 1, username: 1 } },
      }) // populate replies users if its a user who replied
      .sort("createdAt")
      .limit(perPagination);
    return { success: true, code: 200, data };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//function to count the amount of comments that exists for that video
export const findCommentAmount = async ({ videoRef }: { videoRef: string }): Promise<ResultTypes> => {
  try {
    const count = await Comment.aggregate([
      {
        $match: {
          videoRef: {
            $eq: new ObjectId(videoRef),
          },
        },
      },
      {
        $count: "amount",
      },
    ]);

    if (count) {
      //if everything went well
      return {
        success: true,
        code: 200,
        data: { amount: count[0] },
      };
    }
    //if videoref didnt exist didnt go well
    return { success: false, code: 404, error: "This video ref does not exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//function to delete comment
export const deleteOneComment = async (commentId: string, idType: "user" | "channel", id: string): Promise<ResultTypes> => {
  try {
    const idToUse = () => {
      if (idType === "user") {
        return { user: id };
      }
      return { channel: id };
    };
    //run a delete operation on the model of comment
    const deleteDoc = await Comment.findOneAndDelete({ _id: commentId, ...idToUse });
    if (deleteDoc) {
      //if everything went well
      return {
        success: true,
        code: 200,
      };
    }
    //if document didnt exist didnt go well
    return { success: false, code: 404, error: "This comment does not exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//function to delete reply
export const deleteOneReply = async (replyId: string, idType: "user" | "channel", id: string): Promise<ResultTypes> => {
  try {
    //run a delete operation on the model of Reply and remove the corresponding id from comments
    const idToUse = () => {
      if (idType === "user") {
        return { user: id };
      }
      return { channel: id };
    };
    const deleteDoc = await Reply.findOneAndDelete({ _id: replyId, ...idToUse });

    if (deleteDoc) {
      //if everything went well
      return {
        success: true,
        code: 200,
      };
    }
    //if document didnt exist didnt go well
    return { success: false, code: 404, error: "This reply does not exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};
