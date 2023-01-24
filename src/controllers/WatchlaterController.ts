import { Request, Response } from "express";
import { addToWatchlater, DeleteFromWatchlater } from "../services/Watchlater";

//add to watch later
export const add_To_Watchlater = async(req:Request, res:Response)=>{
const { userId, videoId} = req.body;   
if(userId && videoId){
    try {
        const { success, code, message, error } = await addToWatchlater(userId, videoId);
  
        if (success) return res.status(code).json({ status: code, data: "", message });
  
        //if things didnt go so well
        return res.status(code).json({ status: code, data: "", error, message });
      } catch (e: any) {
        return { success: false, code: 404, error: e.message };
      }
}
return res
    .status(404)
    .json({ status: 404, error: `Provide the proper value for the following: (${videoId ? "" : "videoId,"} ${userId ? "" : "userId"})` });
}

//remove from watch later list

export const remove_From_Watchlater = async(req:Request, res:Response)=>{
const { userId, videoId} = req.body;   
if(userId && videoId){
    try {
        const { success, code, message, error } = await DeleteFromWatchlater(userId, videoId);
  
        if (success) return res.status(code).json({ status: code, data: "", message });
  
        //if things didnt go so well
        return res.status(code).json({ status: code, data: "", error });
      } catch (e: any) {
        return { success: false, code: 404, error: e.message };
      }
}
return res
    .status(404)
    .json({ status: 404, error: `Provide the proper value for the following: (${videoId ? "" : "videoId,"} ${userId ? "" : "userId"})` });

}