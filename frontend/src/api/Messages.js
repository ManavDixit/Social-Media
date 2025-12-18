const url = import.meta.env.VITE_SERVER_URL;
import { setAlert } from "../Reducers/Alert";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setMessages } from "../Reducers/Messages";
export const getContacts=async ({dispatch})=>{
     const token = localStorage.getItem("token");
  if (!token) {
    navigate("/register");
    throw new Error("unautharised");
  }else{

      try {
          const response=await fetch(`${url}/message/getContacts`,{
            method:"get",
            headers:{
                token
            }
          })
          const data=await response.json();
          return data.data;
      } catch (error) {
          dispatch(
            setAlert({ message: `Unable to fetch conatacts`, type: "error" })
          );
          console.log(error)
          return [];
      }
  }
}

export const sendMessage=async ({message,from,to,dispatch})=>{
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/register");
    throw new Error("unautharised");
  }else{

      try {
          const response=await fetch(`${url}/message/sendMessage`,{
            method:"post",
            headers:{
                token,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
              to,
              message
            }),
            
          })
          const data=await response.json();
          dispatch(setMessages(data.message));
      } catch (error) {
          dispatch(
            setAlert({ message: `Unable to send message`, type: "error" })
          );
          console.log(error);
      }
  }
}

export const getMessages=createAsyncThunk(
    'getMessages',
    async ({dispatch, signal,to,lastMessageCreatedAt})=>{
      const token = localStorage.getItem("token");
  if (!token) {
    navigate("/register");
    throw new Error("unautharised");
  }else{

      try {
          const response=await fetch(`${url}/message/getMessages?to=${to}&cursor=${lastMessageCreatedAt}&limit=${5}`,{
            signal,
            method:"get",
            headers:{
                token
            },
          })
          const data=await response.json();
          if (data.success) {
          return data;
        } else {
          console.log(data.error);
          dispatch(
            setAlert({ message: `Unable to fetch messages error ${data.error}`, type: "error" })
          );
          throw new Error(JSON.stringify(data.error));
        }
      } catch (error) {
          dispatch(
            setAlert({ message: `Unable to fetch Messages`, type: "error" })
          );
          console.log(error);
          throw new Error(JSON.stringify(data.error));
      }
  }
    }
)