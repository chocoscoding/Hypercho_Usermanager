import { Router } from "express";
import {GetAll_Subbbed, GetOne_Sub_Status, subscribe_And_Unsubscribe, GetOne_Sub_Status_By_Name} from '../controllers/SubscriptionController' 
const r = Router();

r.post('/', subscribe_And_Unsubscribe) // subscribe and unsubscribe 
r.post('/One',GetOne_Sub_Status ) // check if the user is subbed to that channel
r.post('/OneByName',GetOne_Sub_Status_By_Name ) // check if the user is subbed to that channel
r.post('/All',GetAll_Subbbed) //get all channels a user is subscribed to
export default r;

