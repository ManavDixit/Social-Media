import React,{useState,useEffect} from 'react'
import './Followers.css';
import { Link } from 'react-router-dom';
import { followUser } from '../../../api/Profile';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../../api/Profile';
const Followers = ({type,data,setData,userEmail}) => {
  const [followers, setFollowers] = useState([]);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  useEffect(() => {
    setFollowers([...data]);
  }, [data]);

  const {profile}=useSelector((state)=>state)
  const follow=async (email,wannaFollow)=>{
    followUser(email).then(async ()=>{
      const userData=await getProfile({email:userEmail,dispatch,navigate});
    setData(userData);
    }).catch((error)=>{
      console.log(error);
    })
    
  }
  return (
    <div className='followers'>
      <h2>
        {type}:
      </h2>
    

      {data.map((follower)=><div className='follower' key={follower.email}>    <div className="pfp">{/* <img src="" alt="" /> */}{follower.user[0].toUpperCase()}</div> <Link to={`/profile?email=${follower.email}`} onClick={(e)=>{if(!follower.email){e.preventDefault()}}}>{follower.user}</Link>
      { follower.email!==profile.email?
        follower.isFollowing? <button onClick={()=>{
          follow(follower.email,false)
        }}>UnFollow</button>: <button onClick={()=>{
           
           follow(follower.email,true)
          
         }}>Follow</button>:null
      }
     
      
      </div>
      
      )}
      
    </div>
  )
}

export default Followers