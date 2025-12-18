import {createSlice} from "@reduxjs/toolkit";
import { getMessages } from "../api/Messages";
import messages from "../components/Messages/Messages";
const messagesReducers=createSlice({
name:"messages",
initialState:{
    messages:[],
    loading:false,
    error:""
},
reducers:{
setMessages:(state,action)=>{
state.messages=[...state.messages,action.payload];
},
clearMessages:(state)=>{
    state.messages=[];  
}
},
extraReducers:(builder)=>{
        
        builder.addCase(getMessages.fulfilled,(state,action)=>{
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
export const{setMessages,clearMessages}=messagesReducers.actions;