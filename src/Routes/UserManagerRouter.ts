import { Router } from "express";
import { changeProfilePic, changeUsername, toggleSaveHistory,userinfo } from "../controllers/UserController";
const r = Router();

r.post("/Profile/username", changeUsername);
r.post("/Profile/profilePic", changeProfilePic);
r.post("/History", toggleSaveHistory);
r.post("/Profile/info", userinfo);
export default r;
