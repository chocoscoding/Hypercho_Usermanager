import { ObjectId } from "mongodb";
import logg from "../Logs/Customlog";
import { User, WatchLater } from "../models";
import { ResultTypes } from "../types/main";
import { doesVideoExist } from "../utils";

//add to watch later
export const addToWatchlater = async (userId: string, videoId: string): Promise<ResultTypes> => {
  const newId = new ObjectId(videoId);
  //check if the video is in the Watchlater array
  try {
    const doesExist = doesVideoExist(videoId);
    const count = WatchLater.countDocuments({ userId });
    const userExist = await User.findById(userId, "_id");
    const InList = WatchLater.findOne({ userId, videoId }); //check if the user has that same video in watch later already
    const initdata: any = await Promise.allSettled([doesExist, count, InList, userExist]);

    const finalDoesExist = initdata[0].value;
    const finalCount = initdata[1].value;
    const finalInList = initdata[2].value;
    const finalUserExist = initdata[3].value;
    if (!finalDoesExist) {
      //if video doesnt exist
      return {
        success: false,
        message: "Video does not exist",
        code: 404,
      };
    } else if (finalCount > 400) {
      //
      return {
        success: false,
        message: "Remove some videos from watch later",
        code: 403,
      };
    } else if (finalInList) {
      //if the user alreafy has it in watch later
      return {
        success: false,
        message: "This video is already in your list",
        code: 403,
      };
    } else if (!finalUserExist) {
      //if the user deosnt exist
      return {
        success: false,
        message: "user doesnt exist",
        code: 403,
      };
    } else {
      const newData = new WatchLater({
        userId,
        Ref: videoId,
      });
      await newData.save();
      return { success: true, code: 200, data: "", message: `Video added successfully` };
    }
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};

//delete from watch later
export const DeleteFromWatchlater = async (userId: string, videoId: string): Promise<ResultTypes> => {
  //check if the channelId is in the Watchlater array
  try {
    const WatchLaterData = await WatchLater.findOneAndDelete({ userId, Ref: videoId });
    if (WatchLaterData) {
      
      //if the video was successfully deleted
      return { success: true, code: 200, data: "", message: `Video added successfully` };
    }
    return { success: false, code: 404, data: "", error: "This data didnt exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};
