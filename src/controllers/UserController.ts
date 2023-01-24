import { Request, Response } from "express";
import { updateUserProfilePic, updateUserUsername, updateWatchHisoryPrefrence, getUserInfo} from "../services/UserManager";

//change toggle save watch history
export const toggleSaveHistory = async (req: Request, res: Response) => {
  const { userId, pause } = req.body;
  if (userId && typeof pause === "boolean") {
    try {
      const { success, code, message, error } = await updateWatchHisoryPrefrence(userId, pause);

      if (success) return res.status(code).json({ status: code, data: "", message });

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e: any) {
      return { success: false, code: 404, error: e.message };
    }
  }
  return res
    .status(404)
    .json({ status: 404, error: `Provide the proper value for the following: (${pause ? "" : "pause,"} ${userId ? "" : "userId"})` });
};

//change the user's profile pic
export const changeProfilePic = async (req: Request, res: Response) => {
  const { userId, imageName } = req.body;
  if (userId && imageName) {
    try {
      const { success, code, message, error } = await updateUserProfilePic(userId, imageName);

      if (success) return res.status(code).json({ status: code, data: "", message });

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e: any) {
      return { success: false, code: 404, error: e.message };
    }
  }
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${imageName ? "" : "imageName,"} ${userId ? "" : "userId"})`,
  });
};

//change the user's username
export const changeUsername = async (req: Request, res: Response) => {
  const { userId, newUsername } = req.body;
  if (userId && newUsername) {
    try {
      const { success, code, message, error } = await updateUserUsername(userId, newUsername);

      if (success) return res.status(code).json({ status: code, data: "", message });

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });
    } catch (e: any) {
      return { success: false, code: 404, error: e.message };
    }
  }
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${newUsername ? "" : "newUsername,"} ${userId ? "" : "userId"})`,
  });
};

export const userinfo = async(req:Request, res:Response)=>{
  const {type,type_value} = req.body;
  if(type_value && type){
    try{
      const {success, code, message, error, data } = await getUserInfo(type_value,type);

      if (success){
         return res.status(code).json({ status: code, data: data, message });
      }

      //if things didnt go so well
      return res.status(code).json({ status: code, data: "", error });

    }catch(e:any){
      return {success:false, code: 404, error: e.message};
    }
  }
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the userId`,
  });
};