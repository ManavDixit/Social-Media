import mongoose from "mongoose";
const MessageSchema=mongoose.Schema(
{
    from: { type: String, required: true },
    to:{type:String,required:true},
    message:{type:String,required:true},
    read:{type:Boolean,required:true,default:false},
    createdAt:{
        type:Date,
        default:Date.now
    },
}
);
const MessagesModel= mongoose.model("messages",MessageSchema);
export default MessagesModel;