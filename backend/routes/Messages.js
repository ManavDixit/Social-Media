import express from 'express';
import { authenticate } from '../middleware/auth.js';
import paginate from "../middleware/pagination.js";
import {getContacts, getMessages,sendMessage} from '../controllers/Messages.js';
import Messages from "../models/Messages.js";
const Router=express.Router();
Router.use(authenticate);
Router.get("/getMessages",(req,res,next)=>{req.options={
          $or:[
                 {to:req.query.to,from:req.email},{to:req.email,from:req.query.to}
             ]
     };next()},paginate(Messages),getMessages)
Router.post("/sendMessage",sendMessage);
Router.get("/getContacts",getContacts);
export default Router;