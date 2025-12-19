import {createSlice} from "@reduxjs/toolkit";
import { getMessages } from "../api/Messages";
import messages from "../components/Messages/Messages";
import { act } from "react";
const messagesReducers=createSlice({
name:"messages",
initialState:{
    messages:[],
    loading:false,
    error:"",
    isNextAvailable:false,
    isPrevAvialble:false,
    activeEmail:null
},
reducers:{
setMessages:(state,action)=>{
    
state.messages=[...state.messages,action.payload];
},
clearMessages:(state)=>{
    state.messages=[];  
},

setActiveEmail:(state,action)=>{
    state.activeEmail=action.payload;
}

},
extraReducers:(builder)=>{
        
        builder.addCase(getMessages.fulfilled,(state,action)=>{
            if(action.payload.to!==state.activeEmail)return;//ignore messages of previosly opened chats
            state.messages =[...action.payload.messages,...state.messages];
            state.isNextAvailable=action.payload.isNextAvailable;
            state.isPrevAvialble=action.payload.isPrevAvialble;
        });
        builder.addCase(getMessages.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(getMessages.rejected,(state,action)=>{
            state.error=action.error;
        });
    }
});
export default messagesReducers.reducer;
export const{setMessages,clearMessages,setActiveEmail}=messagesReducers.actions;