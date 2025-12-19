import { createAsyncThunk } from "@reduxjs/toolkit";
const url = import.meta.env.VITE_SERVER_URL;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
import { setAlert } from "../Reducers/Alert";
export const getPosts = createAsyncThunk(
  "getPosts",
  async ({ navigate, dispatch, signal, page }) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      throw new Error("unautharised");
    } else {
      try {
        console.log(page);
        console.log(signal);
        const response = await fetch(`${url}/posts?page=${page}&limit=${5}`, {
          signal,
          headers: {
            "content-type": "application/json",
            token,
          },
        });
        const data = await response.json();
        if (data.success) {
          return data;
        } else {
          console.log(data.error);
          dispatch(
            setAlert({
              message: `Unable to fetch posts error ${data.error}`,
              type: "error",
            })
          );
          throw new Error(JSON.stringify(data.error));
        }
      } catch (error) {
        console.log(error);
        dispatch(setAlert({ message: `Unable to fetch posts`, type: "error" }));
        throw new Error(error);
      }
    }
  }
);

export const createPost = async ({
  title,
  description,
  attachment,
  dispatch,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/register");
    throw new Error("unautharised");
  } else {
    try {
      let uploadData;
      console.log(attachment);
      if (attachment) {
        if (
          !attachment.type.startsWith("video") &&
          !attachment.type.startsWith("image")
        ) {
          dispatch(
            setAlert({
              message: `Post not uploaded : Invalid file type. Please upload an image or video.`,
              type: "error",
            })
          );
          throw new Error(
            "Invalid file type. Please upload an image or video."
          );
        }
        //getting signature and timestamp from server
        const Res = await fetch(`${url}/posts/uploadtocloudinary`, {
          method: "post",
          headers: { 
            token,
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({
            resource_type: attachment.type.startsWith("image")
              ? "image"
              : "video",
            file_size: attachment.size,
          }),
        });
        //uploading to cloudinary
        const cloudinaryData = await Res.json();
        if (!cloudinaryData.success) {
          throw new Error(cloudinaryData.error);
        }
        const formData = new FormData();
        formData.append("file", attachment);
        formData.append("api_key", CLOUDINARY_API_KEY);
        formData.append("timestamp", cloudinaryData.cloudinary.timestamp);
        formData.append("signature", cloudinaryData.cloudinary.signature);
        formData.append(
          "folder",
          `uploads/${
            attachment.type.startsWith("image") ? "images" : "videos"
          }/`
        );
        
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${
            attachment.type.startsWith("image")
              ? "image"
              : attachment.type.startsWith("video")
              ? "video"
              : "raw"
          }/upload`,
          {
            method: "post",
            body: formData,
          }
        );
        uploadData = await uploadRes.json();
      }
      //creating post
      const data = {
        title,
        description,
        attachment: attachment ? uploadData.secure_url : null,
        resource_type: uploadData ? uploadData.resource_type : null
      };
      const response = await fetch(`${url}/posts/createpost`, {
        method: "post",
        headers: {
          token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json_res = await response.json();
      if (json_res.success) {
        dispatch(
          setAlert({ message: `Post uploaded successfully`, type: "success" })
        );
      } else {
        console.log(json_res.error);
        dispatch(
          setAlert({
            message: `Post not uploaded : ${json_res.error}`,
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(setAlert({ message: error.error.message, type: "error" }));
    }
  }
};

export const likePost = async ({ postid }) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = fetch(`${url}/posts/likePost`, {
        headers: {
          postid,
          token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const getPostInfo = async ({ navigate, postid, dispatch, signal }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("unautharised");
  } else {
    try {
      const response = await fetch(
        `${url}/posts/getpostinfo?postid=${postid}`,
        {
          signal,
          headers: {
            "content-type": "application/json",
            token,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        return data.post;
      } else {
        dispatch(
          setAlert({ message: `error : ${data.error.message}`, type: "error" })
        );
        navigate("/");
        throw new Error(JSON.stringify(data.error));
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
};
