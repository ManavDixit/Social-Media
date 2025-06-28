const url = import.meta.env.VITE_SERVER_URL;
import { setAlert } from "../Reducers/Alert";
export const getProfile=async ({email,dispatch,navigate})=>{
    const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("unautharised");
  } else {
try {
  const response=await fetch(`${url}/profile?user_email=${email}`,{
    headers: {
      "content-type": "application/json",
      token,
      
    },
  });
  const data=await response.json();
  console.log(data)
  if(data.success){
    return data.user;
  }else{
    dispatch(setAlert({ message: `error : ${data.error}`, type: "error" }));
    navigate('/')
   
  }
} catch (error) {
  console.log(error);
  
}}
}

//function to follow/unfollow user
export const followUser=async(email)=>{
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("unautharised");
  } else {
try {
  const response=await fetch(`${url}/profile/follow?user_email=${email}`,{
    headers: {
      "content-type": "application/json",
      token,
      
    },
  });
  const data=await response.json();
  console.log(data)
  if(data.success){
    return data;
  }else{
    dispatch(setAlert({ message: `error : ${data.error}`, type: "error" }));
    navigate('/')
   
  }
} catch (error) {
  console.log(error);
  
}}
}