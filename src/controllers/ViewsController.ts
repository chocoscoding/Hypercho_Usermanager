import { Request, Response } from "express";
import { addToAmount, addtoWatchHistory_and_Views, DeleteWatchHistory } from "../services/Views";

export const addHistory = async (req: Request, res: Response) => {
  const { videoRef, userId, current, timestamp, Scenes, timeCheck } = req.body;
  const newTimeCheck = timeCheck || new Date().toISOString();
  if (videoRef && userId && current && timestamp && Scenes) {
    try {
      const { success, code, data, message, error } = await addtoWatchHistory_and_Views(
        videoRef,
        userId,
        current,
        timestamp,
        Scenes,
        newTimeCheck
      );
      if (success) {
        return res.status(code).json({ status: code, data, message });
      }
      return res.status(code).json({ status: code, data, error });
    } catch (e: any) {
      return res.status(404).json({ status: 404, data: "", error: e.message });
    }
  }
  return res
    .status(404)
    .json({ status: 404, error: "Provide the proper value for the property: ( videoRef, userId, current, timestamp, Scenes, timeCheck )" });
};
export const deleteHistory = async (req: Request, res: Response) => {
  const { historyId, userId } = req.body;
  if (historyId && userId) {
    try {
      const { success, code, data, message, error } = await DeleteWatchHistory(userId, historyId);
      if (success) {
        return res.status(code).json({ status: code, data, message });
      }
      return res.status(code).json({ status: code, data, error });
    } catch (e: any) {
      return res.status(404).json({ status: 404, data: "", error: e.message });
    }
  }
  return res.status(404).json({ status: 404, error: "Provide the proper value for the property: (historyId, userId)" });
};

export const addViews = async (req: Request, res: Response) => {
  const { videoRef } = req.body;
  if (videoRef) {
    try {
      const { success, code, data, message, error } = await addToAmount(videoRef);
      if (success) {
        return res.status(code).json({ status: code, data, message });
      }
      return res.status(code).json({ status: code, data, error });
    } catch (e: any) {
      return res.status(404).json({ status: 404, data: "", error: e.message });
    }
  }
  return res.status(404).json({ status: 404, error: "Provide the proper value for the property: (videoRef)" });
};
