import logg from "../Logs/Customlog";
import { Like, Video, Comment, Reply, ReplyLike, CommentLike } from "../models";
import { ResultTypes } from "../types/main";
import { doesVideoExist } from "../utils";
//model object for adding docs
const ModelsForDoc: any = {
  Video:Like,
  Reply: ReplyLike,
  Comment: CommentLike,
};
// model for incrementing and decreme
const ModelsForIncOrDec: any = {
  Comment,
  Reply,
  Video,
};

/*----for main video and user---- */

interface upsertUserTypes {
  userId: string;
  videoRef: string;
  type: boolean;
}
interface generalUserTypes {
  userId: string;
  videoRef: string;
}

/* --- user likes/dislikes for videos--- */
export const User_LikeorDislike = async (Ref: string, userId: string, type: boolean, Model: string): Promise<ResultTypes> => {
  //first check if the user has a like or dislike document for that post
  const LikeModel = ModelsForDoc[Model];
  try {
    const doesExist = await doesVideoExist(Ref)
    if (!doesExist) {//if video doesnt exist
      return {
        success: false,
        message: "Video does not exist",
        code: 404}
      }
    const prevDoc: { userId: string; Ref: string; type: boolean } | null = await LikeModel.findOne({ userId, Ref });
    //if the user doc doesn't exist
    if (!prevDoc) {
      await LikeModel.updateOne({ userId, Ref }, { type }, { upsert: true });
      //increment the type
      if (type) {
        //if type is true which is like
        await increase(Model, Ref, "likes");
        return { success: true, code: 200, data: "", message: `${Model} liked successfully` };
      } else {
        //if type is false which is dislike
        await increase(Model, Ref, "dislikes");
        return { success: true, code: 200, data: "", message: `${Model} disliked successfully` };
      }
    }
    //if the user doc exists
    else {
      if (prevDoc.type === type) {
        //if the new type (true:like,false:dislike) is the same as the one gotten from the db, then return an error
        return { success: false, code: 403, error: "user cant perform this action twice on the same document" };
      }
      //if its not the same, switch them
      else {
        await LikeModel.updateOne({ userId, Ref }, { type }, { upsert: true });
        if (type) {
          //if the user is switching to like from dislike
          await increase(Model, Ref, "likes");
          await decrease(Model, Ref, "dislikes");
          return { success: true, code: 200, data: "", message: `${Model} liked successfully` };
        }
        //if the user is switching to dislike from like
        await increase(Model, Ref, "dislikes");
        await decrease(Model, Ref, "likes");
        return { success: true, code: 200, data: "", message: `${Model} disliked successfully` };
      }
    }
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};
export const User_Undo_LikeorDislike = async (Ref: string, userId: string, Model: string) => {
  //to remove the like on a comment
  //we have to make sure the user exists, to prevent removing and reducing wrongly
  const LikeModel = ModelsForDoc[Model];
  try {
    const prevDoc: { userId: string; Ref: string; type: boolean } | null = await LikeModel.findOne({ userId, Ref });

    if (!prevDoc) {
      //if there is not like/dislike document for that user
      return { success: false, code: 403, error: `this user hasn't liked/disliked before` };
    }
    //if there is...
    //delete the data found from the id and ref supplied
    await LikeModel.deleteOne({ userId, Ref });
    //reduce like or dislike count based on the type gotten from the db
    if (prevDoc.type) {
      //if the type was true
      await decrease(Model, Ref, "likes");
      return { success: true, code: 200, message: `like undone successfully`, data: "" };
    }
    //else
    await decrease(Model, Ref, "dislikes");
    return { success: true, code: 200, message: `dislike undone successfully`, data: "" };
  } catch (e: any) {
    //if everything doesn't go well
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};
//find one like and unlike data for one video
export const getOne_LikeOrDislike_For_Video = async (userId: string, Ref: string): Promise<ResultTypes> => {
  try {
    //add the new document to the liked collection
    const data = await Like.findOne({ userId, Ref }, "type");
    //if the data is not found
    if (!data) return { success: false, data, code: 200 };
    return { success: true, data, code: 200 };
  } catch (e: any) {
    //if everything doesn't go well
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

export const getAll_LikeOrDislike_For_Video = async (userId: string): Promise<ResultTypes> => {
  try {
    //add the new document to the liked collection
    const data = await Like.find({ userId })
      .limit(800)
      .sort("updatedAt")
      .populate({
        path: "Ref",
        select: { Views: 1, Title: 1, key: 1, coverPhoto: 1, Published: 1, Publish: 1, channelId: 1 },
        populate: {
          path: "channelId",
          select: { _id: 1, mainPic: 1, channel_name: 1, profilePic: 1, username: 1 },
        },
      }); // populate the like data

    //if the data is not found
    if (!data) return { success: false, data, code: 200 };
    return { success: true, data, code: 200 };
  } catch (e: any) {
    //if everything doesn't go well
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

/* --- comments and reply --- */
export const LikeorDislike = async (videoRef: string, Ref: string, userId: string, type: boolean, Model: string): Promise<ResultTypes> => {
  //first check if the user has a like or dislike document for that post
  const LikeModel = ModelsForDoc[Model];
  try {
    const doesExist = await doesVideoExist(videoRef)
    if (!doesExist) {//if video doesnt exist
      return {
        success: false,
        message: "Video does not exist",
        code: 404}
      }
    const prevDoc: { userId: string; Ref: string; type: boolean } | null = await LikeModel.findOne({ userId, Ref });
    //if the user doc doesn't exist
    if (!prevDoc) {
      await LikeModel.updateOne({ userId, Ref, videoRef }, { type }, { upsert: true });
      //increment the type
      if (type) {
        //if type is true which is like
        await increase(Model, Ref, "likes");
        return { success: true, code: 200, data: "", message: `${Model} liked successfully` };
      } else {
        //if type is false which is dislike
        await increase(Model, Ref, "dislikes");
        return { success: true, code: 200, data: "", message: `${Model} disliked successfully` };
      }
    }
    //if the user doc exists
    else {
      if (prevDoc.type === type) {
        //if the new type (true:like,false:dislike) is the same as the one gotten from the db, then return an error
        return { success: false, code: 403, error: "user cant perform this action twice on the same document" };
      }
      //if its not the same, switch them
      else {
        await LikeModel.updateOne({ userId, Ref, videoRef }, { type }, { upsert: true });
        if (type) {
          //if the user is switching to like from dislike
          await increase(Model, Ref, "likes");
          await decrease(Model, Ref, "dislikes");
          return { success: true, code: 200, data: "", message: `${Model} liked successfully` };
        }
        //if the user is switching to dislike from like
        await increase(Model, Ref, "dislikes");
        await decrease(Model, Ref, "likes");
        return { success: true, code: 200, data: "", message: `${Model} disliked successfully` };
      }
    }
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 200, data: "", error: e.message };
  }
};
export const Undo_LikeorDislike = async (Ref: string, userId: string, Model: string) => {
  //to remove the like on a comment
  //we have to make sure the user exists, to prevent removing and reducing wrongly
  const LikeModel = ModelsForDoc[Model];
  try {
    const prevDoc: { userId: string; Ref: string; type: boolean } | null = await LikeModel.findOne({ userId, Ref });

    if (!prevDoc) {
      //if there is not like/dislike document for that user
      return { success: false, code: 403, error: `this user hasn't liked/disliked before` };
    }
    //if there is...
    //delete the data found from the id and ref supplied
    await LikeModel.deleteOne({ userId, Ref });
    //reduce like or dislike count based on the type gotten from the db
    if (prevDoc.type) {
      //if the type was true
      await decrease(Model, Ref, "likes");
      return { success: true, code: 200, message: `like undone successfully`, data: "" };
    }
    //else
    await decrease(Model, Ref, "dislikes");
    return { success: true, code: 200, message: `dislike undone successfully`, data: "" };
  } catch (e: any) {
    //if everything doesn't go well
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};
export const getAll_LikeorDislike = async (videoRef: string, userId: string, Model: string): Promise<ResultTypes> => {
  //find all the comments/replies that the user has liked in the video
  const LikeModel = ModelsForDoc[Model];
  try {
    const data = (await LikeModel.find({ videoRef, userId })) || [];
    return { success: true, code: 200, data };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

/* ----------------------- */

/* --- increase or reduce like/dislike count --- */

//function to increase
const increase = async (modelType: string, Id: string, type: string) => {
  const model = ModelsForIncOrDec[modelType];
  try {
    if (type === "likes") {
      await model.findOneAndUpdate({ _id: Id }, { $inc: { likes: 1 } });
    } else {
      await model.findOneAndUpdate({ _id: Id }, { $inc: { dislikes: 1 } });
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
};
//function to decrease
const decrease = async (modelType: string, Id: string, type: string) => {
  const model = ModelsForIncOrDec[modelType];
  try {
    if (type === "likes") {
      await model.findOneAndUpdate({ _id: Id }, { $inc: { likes: -1 } });
    } else {
      await model.findOneAndUpdate({ _id: Id }, { $inc: { dislikes: -1 } });
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
};
/* ------------------------ */
