import React,{useEffect}from 'react'
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
    const navigate=useNavigate();
    const token=localStorage.getItem('token')
    useEffect(()=>{
      if (token) navigate('/')
    },[])
  return (
    <div id='landingPage'>
        <div className='container'>
        <h1>Login to continue</h1>
        <p>Please login or create an account usig the buttons given below</p>
        <div className="buttons">
            <button onClick={()=>{navigate('/login')}}>Login</button>
            <button onClick={()=>{navigate('/register')}}>Signup</button>
        </div>
        </div>
        
    </div>
  )
}

export default LandingPage