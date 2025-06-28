import './Comment.css';
import React,{forwardRef,useState,useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { likeComment } from '../../api/comments';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
const Comment = forwardRef(({userName,message,hasLiked,commentid,postid,email},ref) => {
  const dispatch=useDispatch();
  const [liked, setLiked] = useState(hasLiked);
  const handleLike=(e)=>{
    e.stopPropagation();
    setLiked(liked=>!liked)
    likeComment({postid,commentid})
  };
  return (
    <div ref={ref} className='comment'>
        <div className="userInfo">
        <div className="userPicName">{userName ? userName.charAt(0).toUpperCase() : ""}</div>
        <Link to={`/profile?email=${email}`} onClick={(e)=>{e.stopPropagation();if(!email){e.preventDefault();}}}>
       {userName}
       </Link>
      </div>
      <div className="message">{message}</div>

      <div className="buttons">
        <FontAwesomeIcon icon={faHeart} style={{color:liked?'red':'black'}} onClick={handleLike}/>
      </div>
    </div>
  )
})

export default Comment