import React,{useEffect}from 'react'
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const MainElement = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/landing');
    }
  },[])
  return (
    <div className='mainelement'>
        <Outlet/>
    </div>
  )
}

export default MainElement