import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
const initialState={
    loading:false,
    posts:[],
    name:'',
    email:'',
    pfp:null
    
}

const ProfileReducer=createSlice({
    name:'Profile',
    initialState,
    reducers:{
        setProfile:(state,action)=>{
            return {...action.payload};
        },
        editProfile:(state,action)=>{
            return {...state,...action.payload}
        },
        setLoading:(state,action)=>{
            return {...state,loading:action.payload};
        },signOut:(state,action)=>{
            localStorage.clear();
            return initialState;
        }
    },
    extraReducers:(builder)=>{
        
        
    }
})
export const {setProfile,editProfile,setLoading,signOut}=ProfileReducer.actions;
export default ProfileReducer.reducer;