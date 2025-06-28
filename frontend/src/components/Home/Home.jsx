import './Home.css';
import React, { useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import PostContainer from '../PostsContainer/PostContainer';
import Notifications from '../Notifications/Notifications';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const token=localStorage.getItem('token');
  const navigate=useNavigate();
  useEffect(()=>{
    if (!token) navigate('/landing');
  },[])
  return (
    token ? (<div id='home'>
        {/* <Sidebar/> */}
        <PostContainer/>
        {/* <Notifications/> */}
        
    </div>
  ) : null)
}

export default Home