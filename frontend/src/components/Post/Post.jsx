import "./Post.css";
import React, { useEffect, useState ,forwardRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import { getImage} from "../../api/Uploads";
import { likePost } from "../../api/posts";
import {useDispatch} from 'react-redux';
import { setAlert } from "../../Reducers/Alert";
import { Link } from "react-router-dom";
const Post = forwardRef(({ title, description, postimg, postvideo ,hasLiked,postid,userName,onClick,email},ref) => {
  const token=localStorage.getItem('token')
  const url = import.meta.env.VITE_SERVER_URL;
  const [imgdata, setImagedata] = useState(null);
  const [liked, setLiked] = useState(false); 

  useEffect(() => {
    setLiked(hasLiked);
  }, [hasLiked]);
  
  const dispatch=useDispatch();

  useEffect(() => {
    const fetchImage = async () => {
      const img = postimg ? await getImage(postimg) : null;
  
      setImagedata(img);
    };

    if (postimg) fetchImage();
  }, [postimg]);

  const handleLike=(e)=>{
    e.stopPropagation();
    setLiked(!liked);
    likePost({postid})
  };

  const sharePost=async (e)=>{
    e.stopPropagation();
    //check if sharing available
    if(navigator.share){
      //if sharing available
      await navigator.share({
        title,
        url:`/postinfo?postid=${postid}`
      });
    }else{
      //if sharing not  available
      console.log('not supported')
      if (navigator.clipboard){
        navigator.clipboard.writeText(`${window.location.hostname}/postinfo?postid=${postid}`)
      }else{
        console.log('copy not supported');
        dispatch(setAlert({ message: `error : sharing not supported`, type: "error" }))
      }
    }
  }
  return (
    <div ref={ref} className="post" onClick={onClick}>
      <div className="userInfo">
        <div className="userPicName">{userName ? userName.charAt(0).toUpperCase() : ""}</div>
       <Link to={`/profile?email=${email}`} onClick={(e)=>{e.stopPropagation();if(!email){e.preventDefault();}}}>
       {userName}
       </Link>
        
        
         
      </div>
      <div className="title">
        <h3>{title}</h3>
      </div>
      {postimg ? (
        <div className="img">
          <img src={URL.createObjectURL(new Blob([imgdata]))} alt="img" />
        </div>
      ) : null}
      {postvideo ? (
        <div className="img">
          <video
            controls
          >
            <source src={`${url}/uploads/video?src=${postvideo}&token=${token}`}></source>
          </video>
        </div>
      ) : null}
      <div className="description">{description}</div>
      <div className="buttons">
        <FontAwesomeIcon icon={faHeart} style={{color:liked?'red':'black'}} onClick={handleLike}/>
        <FontAwesomeIcon icon={faComment} />
        <FontAwesomeIcon icon={faShare} onClick={sharePost} />
      </div>
    </div>
  );
});

export default Post;
