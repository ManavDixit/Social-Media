import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { getProfile } from "../../api/Profile";
import spinner from '../../assets/spinner.svg'
import Posts from "./Posts/Posts";
import Followers from "./Followers/Followers";
import { followUser } from "../../api/Profile";
import { signOut } from "../../Reducers/Profile";
const Profile = () => {
  const token=localStorage.getItem('token');
  let [searchParams, setSearchParams] = useSearchParams();
  const email=searchParams.get('email');
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [data,setData]=useState({
    name:'',
    email:'',
    posts:[],
    followers:[],
    following:[],
    isMyProfile:false,
    loding:false,
    isFollowing:false
  });
  const {profile}=useSelector((state)=>state)
  const [mode,setMode]=useState('posts');
  useEffect(()=>{
    (async ()=>{
      console.log('hii');
      setData(data=>{return {...data,loding:true}})
      const userData=await getProfile({email,dispatch,navigate});
      setData({...userData,loding:false});
      setMode('posts')
    })()
  },[email]);
  //function to navigate to posts/followers/following
  const Navigate=(event)=>{
    const newMode=(event.target.innerHTML).split(' ')[1].toLowerCase();// from 07 POSTS gets posts
    if(newMode!==mode){

      setMode(newMode);
    }
  }
  //function to follow/unfollow
  const follow=async ()=>{
    await followUser(data.email);
    const updatedUserData=await getProfile({email,dispatch,navigate});
      setData(updatedUserData);
  }
  //function to signout user
  const signout=()=>{
    //dispathing signout
    dispatch(signOut());
    //navigating to landing page
    navigate('/landing')
  }
  return (
    <div id="profile">
      <div className="profilecontainer">
        <div className="info">

        <div className="pfp">{/* <img src="" alt="" /> */}M</div>
        <div className="data">
          <ul>
            <li>Name : {data.name} </li>
            <li>Email: {data.email}</li>
          </ul>
          {
            !data.isMyProfile?data.isFollowing?<button onClick={()=>{
             follow();
            }}>UnFollow</button>:<button onClick={()=>{
              follow();
            }} >Follow</button>:null
          }
          
        </div>
        </div>


        <div className="buttons">
          {
            data.isMyProfile?
          <div className="profileRelatedButtons">
          <button onClick={signout}>SIGN OUT</button>
          </div>:null
          }
          <div className="navigationButtons">

          <button onClick={Navigate}>{data.posts.length} POSTS</button>
          <button onClick={Navigate} >{data.followers.length} FOLLOWERS</button>
          <button onClick={Navigate} >{data.following.length} FOLLOWING</button>
          </div>
        </div>
        {
          data.loding?<img className="spinner" src={spinner}/>:null
        }
      </div>
      <div className="container">
        {
          mode==='posts'?<Posts posts={data.posts}/>:mode==='followers'?<Followers setData={setData} userEmail={email} type='followers' data={data.followers}   />:<Followers userEmail={email} setData={setData} type='following' data={data.following}/>
        }
      </div>
    </div>
  );
};

export default Profile;
