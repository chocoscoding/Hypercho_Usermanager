import { Router } from "express";
import { addHistory,addViews, deleteHistory } from "../controllers/ViewsController";
//just to shorten things r=== router in this case and a lot of cases
const r = Router();

r.post("/User", addHistory); // route to add to user watch history
r.delete("/User", deleteHistory); // route to add to user watch history
r.post("/Video", addViews); // route to add to views count 
export default r;
