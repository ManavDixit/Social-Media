import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectToDataBase from './db.js';
import PostRoutes from './routes/Posts.js';
import AuthRoutes from './routes/Auth.js';
import UploadRoutes from './routes/Uploads.js';
import ProfileRoutes from './routes/Profile.js';
import MessageRoutes from './routes/Messages.js';
import { connectToWebSocket } from "./socket/socket.js";
const hostname='127.0.0.1';
// const hostname='192.168.1.43';
const port=process.env.PORT || 8000;
//connecting to database
connectToDataBase();
//connecting to websockets
connectToWebSocket(process.env.FRONTEND_URL,4000);
//inintializing express
const app=express();
//enabling cors
app.use(cors());
//using bodyparser to parse data sended in request
app.use(express.json({extended:true,limit:'10mb'}));
app.use(express.urlencoded({extended:true,limit:'10mb'}));


app.use('/posts',PostRoutes);
app.use('/auth/',AuthRoutes);
app.use('/uploads/',UploadRoutes);
app.use('/profile/',ProfileRoutes);
app.use('/message/',MessageRoutes);
//listing to expess server
app.listen(port,hostname,()=>{
    console.log(`app successfuly listing at ${hostname}:${port} `);
    
})