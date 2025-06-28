import { createSlice } from "@reduxjs/toolkit";
const alertReducer=createSlice({
    name:'alert',
    initialState:{message:'',type:'success'},
    reducers:{
        setAlert:(state,action)=>{
            const {message,type}=action.payload;
            return {
                ...state,message,type
            }
        },
        clearAlert:(state,action)=>{
            return {
                ...state,message:'',type:'success'
            };
        }
    }
})
export default alertReducer.reducer;
export const {setAlert,clearAlert}=alertReducer.actions;