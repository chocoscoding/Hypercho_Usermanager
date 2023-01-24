import { ObjectId } from "mongodb";
import logg from "../Logs/Customlog";
import { Channel, User } from "../models";
import { ResultTypes } from "../types/main";

//function to subscribe/unsubscribe to a channel
export const subAndUnsub = async (channelId: string, userId: string): Promise<ResultTypes> => {
  const newId = new ObjectId(channelId);
  //check if the channelId is in the subscription array
  try {
    const SubscribedData = await User.findById(userId, "Subscription");
    if (SubscribedData) {
      //if the user exist
      const isSubscribed = SubscribedData.Subscription.includes(newId);
      if (isSubscribed) {
        // unsubscribe and reduce subscription count
        await User.updateOne({ _id: userId }, { $pull: { Subscription: channelId } });
        await Channel.findOneAndUpdate({ _id: channelId }, { $inc: { Subscribers: -1 } });
        return { success: true, code: 200, data: "", message: `${userId} Unsubscribed successfully` };
      } else {
        // if the count of subscription is lower than 2500, allow them to add more
        const length: number = SubscribedData.Subscription.length;
        if (length < 2500) {
          //subscribe and increase subscription count
          await User.updateOne({ _id: userId }, { $push: { Subscription: channelId } });
          await Channel.findOneAndUpdate({ _id: channelId }, { $inc: { Subscribers: 1 } });
          return { success: true, code: 200, data: "", message: `${userId} Subscribed successfully` };
        }
        // else, they cant add more
        return { success: false, code: 403, data: "", error: "Exceeded Subscription Limit" };
      }
    }
    return { success: true, code: 404, data: "", error: "User doesn't exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: true, code: 404, data: "", error: e.message };
  }
};

//get subscription data for one channel
export const checkOne = async (channelId: string, userId: string): Promise<ResultTypes> => {
  const newId = new ObjectId(channelId);
  try {
    //find by userid and channel id
    const SubscribedData = await User.find({ _id: userId, Subscription: { $in: [newId] } });

    const isSubscribed = SubscribedData[0];
    if (isSubscribed) {
      //if the user is subscribed to the channel
      return { success: true, code: 200, data: true };
    }
    //if the user isn't subscribed
    return { success: true, code: 200, data: false };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: true, code: 404, data: "", error: e.message };
  }
};

//get subscription data for one channel
export const checkOneByUsername = async (username: string, userId: string): Promise<ResultTypes> => {
  try {
    const getChannel = await Channel.findOne({ username }, "_id");
    //find by userid and channel id
    if (getChannel === null) {
      return { success: true, code: 404, data: "", error: "channel doesn't exist" };
    }
    const newId = new ObjectId(getChannel._id);
    const SubscribedData = await User.find({ _id: userId, Subscription: { $in: [newId] } });

    const isSubscribed = SubscribedData[0];
    if (isSubscribed) {
      //if the user is subscribed to the channel
      return { success: true, code: 200, data: true };
    }
    //if the user isn't subscribed
    return { success: true, code: 200, data: false };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: true, code: 404, data: "", error: e.message };
  }
};

export const getAll = async (userId: string): Promise<ResultTypes> => {
  try {
    const data = await User.findById(userId, "Subscription").populate({
      path: "Subscription",
      select: { _id: 1, channelName: 1, channelPic: 1, username: 1 },
    });
    //if the user found
    if (data) return { success: true, code: 200, data };
    //if a user wasnt found
    return { success: false, code: 403, data: "", error: "no user found" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: true, code: 404, data: "", error: e.message };
  }
};
