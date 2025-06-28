import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { getPosts } from "../api/posts";
const initialState={
    loading:false,
    posts:[],
    error:null,
    isNextAvailable:false,
    isPrevAvialble:false,
    
}
const postReducers=createSlice({
    name:'posts',
    initialState,
    reducers:{
        editPost:(state,action)=>{
            return state;
        },
        deletePost:(state,action)=>{
            return state;
        },
        clearPosts:(state,action)=>{
            return initialState;
        }
    },
    extraReducers:(builder)=>{
        
        builder.addCase(getPosts.fulfilled,(state,action)=>{
            state.posts =[...state.posts,...action.payload.posts];
            state.isNextAvailable=action.payload.isNextAvailable;
            state.isPrevAvialble=action.payload.isPrevAvialble;
        });
        builder.addCase(getPosts.pending,(state,action)=>{
            state.loading=true;
        });
        builder.addCase(getPosts.rejected,(state,action)=>{
            state.error=action.error;
        });
    }
})

export const {editPost,deletePost,clearPosts}=postReducers.actions;
export default postReducers.reducer;