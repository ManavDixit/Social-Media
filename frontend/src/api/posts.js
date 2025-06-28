import { createAsyncThunk } from "@reduxjs/toolkit";
const url = import.meta.env.VITE_SERVER_URL;
import { setAlert } from "../Reducers/Alert";
export const getPosts = createAsyncThunk(
  "getPosts",
  async ({navigate, dispatch, signal,page}) => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
      throw new Error("unautharised");
    } else {
      try {
        console.log(page);
        console.log(signal)
        const response = await fetch(`${url}/posts?page=${page}&limit=${5}`, {
          signal,
          headers: {
            "content-type": "application/json",
            token
          },
        });
        const data = await response.json();
        if (data.success) {
          return data;
        } else {
          console.log(data.error);
          dispatch(
            setAlert({ message: `Unable to fetch posts error ${error}`, type: "error" })
          );
          throw new Error(JSON.stringify(data.error));
        }
      } catch (error) {
        console.log(error);
        dispatch(
          setAlert({ message: `Unable to fetch posts`, type: "error" })
        );
        throw new Error(error);
      }
    }
  }
);

export const createPost = async ({ title, description, attachment,dispatch }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/register");
    throw new Error("unautharised");
  } else {
    try {
        const data=new FormData();
        data.append('title',title)
        data.append('description',description)
        data.append('attachment',attachment)
        const response=await fetch(`${url}/posts/createpost`,{
            method:'post',
            headers:{
                token
            },
            body:data
        });
        const json_res=await response.json();
        if(json_res.success){
          dispatch(setAlert({ message: `Post uploaded successfully`, type: "success" }))
        }else{
          console.log(json_res.error)
          dispatch(setAlert({ message: `Post not uploaded : ${json_res.error}`, type: "error" }))
        }
    } catch (error) {
      dispatch(setAlert({ message: error, type: "error" }))
    }
  }
};

export const likePost=async ({postid})=>{
  const token = localStorage.getItem("token");
if(token){
  try {
    const response=fetch(`${url}/posts/likePost`,{
      headers:{
        postid,
        token
      }
      
    });
  } catch (error) {
    console.log(error);
  }
}
}

export const getPostInfo=async ({navigate,postid,dispatch,signal})=>{
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("unautharised");
  } else {
try {
  const response=await fetch(`${url}/posts/getpostinfo?postid=${postid}`,{
    signal,
    headers: {
      "content-type": "application/json",
      token,
      
    },
  });
  const data=await response.json();
  console.log(data)
  if(data.success){
    return data.post;
  }else{
    dispatch(setAlert({ message: `error : ${data.error}`, type: "error" }));
    navigate('/')
    throw new Error(JSON.stringify(data.error));
  }
} catch (error) {
  console.log(error);
  throw new Error(error);
}
}};