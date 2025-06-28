import { createSlice} from "@reduxjs/toolkit";
const initialState={
    _id: null,
    title: null,
    description: null,
    image: null,
    video: null,
    likes: 1,
    user: null,
    createdAt:null,
    hasLiked: false,
    comments:{comments:[],isNextAvailable:false,isPrevAvialble:false},
    error:null,
    loading:false,
    email:null
}
const postInfoReducer=createSlice({
    name:'postInfo',
    initialState,
    reducers:{
        setPostinfo:(state,action)=>{
            return {...action.payload};
        },
        setComments:(state,action)=>{
            return {...state,comments:action.payload};
        },
        setLoading:(state,action)=>{
            return {...state,loading:action.payload};
        },
        LikePost:(state,action)=>{
            return {...state,hasLiked:!state.hasLiked}
        }
        
    },
    extraReducers:(builder)=>{
        
        
    }
})
export const {setPostinfo,setComments,setLoading,LikePost}=postInfoReducer.actions;
export default postInfoReducer.reducer;