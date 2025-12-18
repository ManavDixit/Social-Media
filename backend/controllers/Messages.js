import { getIo } from "../socket/socket.js";

import MessagesModel from "../models/Messages.js";
/** @type {import("mongoose").Model<any>} */
const Messages = /** @type {import("mongoose").Model<any>} */ (MessagesModel);

import UserModel from "../models/Auth.js";
/** @type {import("mongoose").Model<any>} */
const Users = /** @type {import("mongoose").Model<any>} */ (UserModel);


export const getContacts=async (req,res) => {
    try {
        let users=await Users.find();
        let limit=req.query;
        res.status(200).send({success:true,data:users.filter((user)=>user.email!=req.email).map((user)=>({email:user.email,name:user.name}))});
    } catch (error) {
        res.status(400).send({success:false,error:error.message});
    }
}

export const getMessages=async (req,res)=>{
    /** @type {import("socket.io").Server} */
const io=getIo();
    let from=req.email;
    let {to}=req.query;
    try {
        //checking if reciver exists
        let reciver=await Users.findOne({email:to});
        if(!reciver) return res.status(400).send({success:false,error:"reciver does not exist"});

        //will paginate later
        // const AllMessages=await Messages.find({
        //     $or:[
        //         {to,from},{to:from,from:to}
        //     ]
        // }).sort({date:-1}).lean().limit(10).sort({date:1});
        let isPrevAvialble=req.isPrevAvialble
    let isNextAvailable=req.isNextAvailable
        let messages = req.paginatedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        // let messages = req.paginatedData;
        res.status(200).send({success:true,messages,isNextAvailable,isPrevAvialble});
    } catch (error) {
        res.status(400).send({success:false,error:error.message});
    }
};

export const sendMessage=async (req,res)=>{
    /** @type {import("socket.io").Server} */
const io=getIo();
    let from=req.email;
    let {to, message}=req.body;
    try {
        //checking if reciver exists
        let reciver=await Users.findOne({email:to});
        if(!reciver) return res.status(400).send({success:false,error:"reciver does not exist"});
        //saving message in db
        const newMessage=new Messages({from,to,message});
        const savedNewMessage=await newMessage.save();
        //emit message room(recivers email)
        io.to(to).emit("messageReceived",{
            ...savedNewMessage.toObject(),
        })
        res.status(200).send({success:true,message:savedNewMessage});
    } catch (error) {
        res.status(400).send({success:false,error:error.message});
    }
};