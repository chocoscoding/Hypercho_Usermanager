import { Router } from "express";
import { AllComments, TotalComments, AddNewComment, AddReplyToComment, DeleteComment, DeleteReply } from "../controllers/CommentController";
//just to shorten things r=== router in this case and a lot of cases
const r = Router();

r.post("/", AllComments); //route to get all comments
r.post("/Count", TotalComments); //route to get amount of comments in a video
r.post("/AddReply", AddReplyToComment); //route to add replies on a commen
r.post("/AddComment", AddNewComment); //route to add comments
r.delete("/Comment", DeleteComment); // route to delete comment 
r.delete("/Reply", DeleteReply); // route to delete reply

export default r;
