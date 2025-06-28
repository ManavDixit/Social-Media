const url = import.meta.env.VITE_SERVER_URL;
import { setAlert } from "../Reducers/Alert";

//function to get  comments of a post
export const getComments=async ({post_id,dispatch,page})=>{
    const token = localStorage.getItem("token");
if(token){
try {
    console.log(post_id)
    const response=await fetch(`${url}/posts/getcomments?page=${page}&limit=${5}`,{
        headers:{
            token,
            post_id
        }
        

    })
    const data=await response.json();
    console.log(data)
    if(data.success){
        console.log(data.comments)
        return {comments:data.comments,isNextAvailable:data.isNextAvailable,isPrevAvialble:data.isPrevAvialble}
      }else{
        console.log(data.error)
        dispatch(setAlert({ message: `error: ${data.error}`, type: "error" }))
      }
} catch (error) {
    console.log(error);
    dispatch(setAlert({ message: error, type: "error" }))
}
}
}

//function to add a comment to post
export const addComment=async({post_id,message,dispatch})=>{
    const token = localStorage.getItem("token");
if(token){
try {
    console.log(post_id)
    const response=await fetch(`${url}/posts/addcomment`,{
        method:'post',
        headers:{
            token,
            post_id,
            message
        }
        

    })
    const data=await response.json();
    console.log(data)
    if(!data.success){
        
      
        console.log(data.error)
        dispatch(setAlert({ message: `Cant add comment : ${data.error}`, type: "error" }))
      }
} catch (error) {
    console.log(error);
    dispatch(setAlert({ message: error, type: "error" }))
}
}
}

export const likeComment=async ({postid,commentid})=>{
    const token = localStorage.getItem("token");
  if(token){
    try {
      const response=fetch(`${url}/posts/likecomment`,{
        headers:{
          postid,
          commentid,
          token
        }
        
      });
    } catch (error) {
      console.log(error);
    }
  }
  }