import { ObjectId } from "mongodb";
import logg from "../Logs/Customlog";
import { User, Video, View } from "../models";
import { ResultTypes } from "../types/main";
import { doesVideoExist, timeDifference, toISOStringWithTimezone } from "../utils";
const MAX_HISTORIES = 500;
//add to watch history
export const addtoWatchHistory_and_Views = async (
  videoRef: string,
  userId: string,
  current: string,
  timestamp: string,
  Scenes: { id: string; ans: number }[] | [],
  timeCheck: Date
): Promise<ResultTypes> => {
  try {
    //check if the video exists before saving anything
    const doesExist = await doesVideoExist(videoRef);
    if (!doesExist) {
      //if video doesnt exist
      return {
        success: false,
        message: "Video does not exist",
        code: 404,
      };
    }

    //<--count amount of doc, last doc, latest doc, and if the user wants to save watch history -->
    const count = View.countDocuments({ userId }); //total document count
    const latestDoc = View.find({ userId, Ref: videoRef }).sort("-updatedAt").limit(1); //the latest watch hsitory on a video for a user
    const toBeRemoved = View.find({ userId }).sort("updatedAt").limit(1); //get the oldest watch history document for that user
    const isAllowed = User.find({ _id: userId }, "Settings").limit(1); //check if the user has allowed us to save history

    //<--get all data at once->
    const InitData = await Promise.all([count, latestDoc, toBeRemoved, isAllowed]); //get all the data in parrallel

    //<--if saving is enabled->
    const CANTSAVE = InitData[3][0].Settings.History; //can save watch history
    if (CANTSAVE) {
      //if the user disable saving history
      return { success: true, code: 200, data: "", message: `Saving disabled by user` };
    }

    const hasExisted = InitData[1][0];
    //<--if the video was viewed before or not->
    if (!hasExisted) {
      //if it hasnt been seen before add new doc
      await addNew({ userId, videoRef, current, timestamp, Scenes });
      return { success: true, code: 200, data: "", message: `New video data saved` };
    }
    //-------------------------------------
    else {
      const prevDoc = InitData[1][0];
      /* 
        get time difference, if more that 1 ===24 hrs,
        add a new video to list if not just update
        */
      const checkDoc = prevDoc?.updatedAt;
      const difference: number = timeDifference(toISOStringWithTimezone(timeCheck), toISOStringWithTimezone(checkDoc));

      if (difference < 1) {
        //just for update
        await View.findOneAndUpdate(
          { _id: prevDoc._id },
          {
            timestamp: current,
            Scenes,
          }
        );
        return { success: true, code: 200, data: "", message: `Video updated from user watch history` };
      }
      //-------------------------------------

      //if its more than 24 hrs add new doc
      await addNew({ userId, videoRef, current, timestamp, Scenes });
      countControl(prevDoc._id, InitData[0]);
      return { success: true, code: 200, data: "", message: `New video data saved` };
    }
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};

const countControl = async (id: ObjectId, amount: number) => {
  try {
    if (amount > MAX_HISTORIES) View.deleteOne({ _id: id });
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const addToAmount = async (videoRef: string): Promise<ResultTypes> => {
  try {
    await Video.findOneAndUpdate({ _id: videoRef }, { $inc: { Views: 1 } });
    return { success: true, code: 200, data: "", message: "Updated successfully" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};

// function to add new data to the history collection
const addNew = async ({
  userId,
  videoRef,
  current,
  timestamp,
  Scenes,
}: {
  videoRef: string;
  userId: string;
  current: string;
  timestamp: string;
  Scenes: { id: string; ans: number }[] | [];
}) => {
  try {
    const newData = new View({
      userId,
      Ref: videoRef,
      current,
      timestamp,
      Scenes,
    });
    await newData.save();
  } catch (e: any) {
    throw new Error(e.message);
  }
};


//delete from watch history
export const DeleteWatchHistory = async (userId: string, historyId: string): Promise<ResultTypes> => {
  //check if the channelId is in the Watchlater array
  try {
    const WatchLaterData = await View.findOneAndDelete({ userId, _id: historyId });
    if (WatchLaterData) {
      //if the video was successfully deleted
      return { success: true, code: 200, data: "", message: `Video removed from your history successfully` };
    }
    return { success: false, code: 404, data: "", error: "This data doesn't exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};

