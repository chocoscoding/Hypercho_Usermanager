import { Router } from "express";
import { add_To_Watchlater, remove_From_Watchlater } from "../controllers/WatchlaterController";
const r = Router();

r.post('/add', add_To_Watchlater)
r.delete('/delete', remove_From_Watchlater)
export default r;
