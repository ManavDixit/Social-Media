import React,{useState,useEffect} from 'react'
import './Signin.css';
import { getGoogleAuthUrl } from '../../extraFunctions/googleLogin';
import { handleInputChange } from '../../extraFunctions/common';
import {signIn} from '../../api/auth';
import {useDispatch} from 'react-redux';
import {validateEmail,validatePassword} from '../../extraFunctions/validate';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons';

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/>
    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
  </svg>
);

const Signin = ({setUserData}) => {
  const dispatch=useDispatch();
  const [info,setInfo]=useState({email:'',password:''});
  const navigate=useNavigate();
  const token=localStorage.getItem('token');
  useEffect(()=>{
    if (token )navigate('/')
  },[])
  const validate=()=>{
    setInfo({...info,email:info.email.trim(),password:info.password.trim()});
    const signin_email_validate_text=document.getElementById('signin_email_validate_text');
    const signin_password_validate_text=document.getElementById('signin_password_validate_text');
    signin_email_validate_text.style.visibility='hidden';
    signin_password_validate_text.style.visibility='hidden'
    if(!validateEmail(info.email)){
      signin_email_validate_text.style.visibility='visible';
    }
    if(!validatePassword(info.password)){
      
      signin_password_validate_text.style.visibility='visible';
    }
    if(validateEmail(info.email) && validatePassword(info.password)){
      
      signIn(info,dispatch,navigate,setUserData);
    }
    
  }
  //function to show/hide password
  const [eyeIcon,setEyeIcon]=useState(faEye);
  const handleHideShowPassword=(e)=>{
    const input=document.getElementById('password');
    if(eyeIcon===faEye) {

      setEyeIcon(faEyeSlash)
    }else{
      setEyeIcon(faEye)
    }
    if(input.type==='password'){
      input.type='text'
    }else{
      input.type='password';
    }
  }
  return (
    <div id='signin'>
      <div className='auth-card'>
        <aside className='auth-panel'>
          <p className='auth-panel-title'>Good to see you again.</p>
          <p className='auth-panel-text'>Log in to catch up with your people.</p>
        </aside>
        <form action="">
            <h1>Login</h1>
            <input type="email" name='email' id='email' placeholder='Email' autoComplete='email' value={info.email} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <p id='signin_email_validate_text' className='validate'>Enter a valid email</p>
            <div className="password-field">
              <input type="password" name='password' id='password' placeholder='Password' autoComplete='current-password' value={info.password} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
              <FontAwesomeIcon icon={eyeIcon} onClick={handleHideShowPassword}/>
            </div>
            <p id='signin_password_validate_text' className='validate'>password must be between 8 to 12 character</p>
            <Link to='/register'>Create account</Link>
            <button className='primary-btn' onClick={(e)=>{e.preventDefault();validate();}}>Login</button>
            <p className='divider'>or</p>
            <button className='google-btn' onClick={(e)=>{e.preventDefault();window.location=getGoogleAuthUrl()}}><GoogleIcon/>Login With Google</button>
        </form>
      </div>
    </div>
  )
}

export default Signin
