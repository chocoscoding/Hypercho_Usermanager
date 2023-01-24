import { Request, Response } from "express";
import logg from "../Logs/Customlog";
import {checkOne, getAll, subAndUnsub,checkOneByUsername} from '../services/Subscribe'

export const subscribe_And_Unsubscribe = async (req:Request, res: Response)=>{
const {channelId, userId}= req.body;
if(channelId && userId){
    try{
const {success, code, data, message,error}=await subAndUnsub(channelId, userId);
if(success){
    return res.status(code).json({status:code, data, message});
}
return res.status(code).json({status:code, data, error});
}catch(e:any){
    logg.fatal(e.message);
    return res.status(404).json({status:404, data: "", error: "Something Went wrong, Try again"});
}}
 return res.status(404).json({ status: 404, error: "Provide the proper value for the property: (channelId and userId)" });
}

export const GetOne_Sub_Status = async (req: Request, res: Response)=>{
    const {channelId, userId}= req.body;
    if(channelId && userId){try{
const {success, code, data, message,error}=await checkOne(channelId, userId);
if(success){
    return res.status(code).json({status:code, data, message});
}
return res.status(code).json({status:code, data, error});
}catch(e:any){
    logg.fatal(e.message);
    return res.status(404).json({status:404, data: "", error: "Something Went wrong, Try again"});
}   }
return res.status(404).json({ status: 404, error: "Provide the proper value for the property: (channelId and userId)" });
}
export const GetOne_Sub_Status_By_Name = async (req: Request, res: Response)=>{
    const {username, userId}= req.body;
    if(username && userId){try{
const {success, code, data, message,error}=await checkOneByUsername(username, userId);
if(success){
    return res.status(code).json({status:code, data, message});
}
return res.status(code).json({status:code, data, error});
}catch(e:any){
    logg.fatal(e.message);
    return res.status(404).json({status:404, data: "", error: "Something Went wrong, Try again"});
}   }
return res.status(404).json({ status: 404, error: "Provide the proper value for the property: (channelId and userId)" });
}
export const GetAll_Subbbed = async (req: Request, res: Response)=>{
    const {userId}= req.body;
    if(userId){try{
const {success, code, data, message,error}=await getAll(userId);
if(success){
    return res.status(code).json({status:code, data, message});
}
return res.status(code).json({status:code, data, error});
}catch(e:any){
    logg.fatal(e.message);
    return res.status(404).json({status:404, data: "", error: "Something Went wrong, Try again"});
}   }

return res.status(404).json({ status: 404, error: "Provide the proper value for the property: (userId)" });
}