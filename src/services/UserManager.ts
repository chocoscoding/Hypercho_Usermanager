import logg from "../Logs/Customlog";
import { User } from "../models";
import { ResultTypes } from "../types/main";

//update the users profile pic
export const updateUserProfilePic = async (userId: string, imageName: string): Promise<ResultTypes> => {
  try {
    //find the user and update
    const Update = await User.findOneAndUpdate({ _id: userId }, { profilePic: imageName }, { _id: 1 });
    //check if the user existed
    if (Update?._id) {
      return { success: true, code: 200, message: "Profile pic updated successfully" };
    }
    return { success: false, code: 403, error: "User didnt exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }

  //the update the pic
};

//update the username
export const updateUserUsername = async (userId: string, newUsername: string): Promise<ResultTypes> => {
  const finalNew = newUsername.toLowerCase().trim().replace(" ", "");
  try {
    //find the user
    const CheckUsername = await User.findOne({ username: finalNew }, "_id");
    //if the username is already existing
    if (CheckUsername) {
      return { success: false, code: 403, error: "username is already in use" };
    } else {
      //if the username isnt used, update
      const UpdatedUsername = await User.findOneAndUpdate({ _id: userId }, { username: finalNew });
      if (UpdatedUsername?._id) {
        //check if user existed
        return { success: true, code: 200, message: "Username updated succesfully" };
      }
      //if the user didnt exist
      return { success: false, code: 403, error: "User didnt exist" };
    }
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};
//update the Save watch history prefrence

export const updateWatchHisoryPrefrence = async (userId: string, pause: boolean): Promise<ResultTypes> => {
  //update by id
  try {
    const changedPref = await User.findOneAndUpdate({ _id: userId }, { "Settings.History": pause }, { _id: 1 });
    //check if changedPref has an object with id of _id
    if (changedPref?._id) {
      //check if user existed
      return { success: true, code: 200, message: "Preference updated succesfully" };
    }
    //  else
    return { success: false, code: 403, error: "User didnt exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//get User Information
export const getUserInfo = async(type_value:string, type:string) : Promise<ResultTypes> =>{
  try{
    if(type === 'Id'){
      const info = await User.findOne({_id:type_value});
      if(info){
        return { success: true, code: 200,  message: "User found succesfully" , data : info};
      }

      return { success: false, code: 403, error: "User didnt exist" };
    }
    else if(type === 'Email'){
      const info = await User.findOne({ email: type_value});
      if(info){
        return { success: true, code: 200,  message: "User found succesfully" , data : info};
      }

      return { success: true, code: 202, message: "User didnt exist"};
    }
    else{
      return {success:false, code: 404, error:"Provide the proper value for the type"};
    }
    }catch(e:any){
      logg.fatal(e.message);
      return { success: false, code: 404, error: e.message };
    }
};