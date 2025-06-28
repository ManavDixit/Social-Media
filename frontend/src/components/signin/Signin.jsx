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
          <form action="">
            <h1>Login</h1>
            <input type="email" name='email' id='email' placeholder='Email' value={info.email} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <p id='signin_email_validate_text' className='validate'>Enter a valid email</p>
            <div id="signinpasswordInputContainer">

            <input type="password" name='password' id='password' placeholder='Password' value={info.password} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <FontAwesomeIcon icon={eyeIcon} onClick={handleHideShowPassword}/>
            </div>
            <p id='signin_password_validate_text' className='validate'>password must be between 8 to 12 character</p>
            <Link to='/register'>Create account</Link>
            <button onClick={(e)=>{e.preventDefault();validate();}}>Login</button>
            <p>-OR-</p>
            <button onClick={(e)=>{e.preventDefault();window.location=getGoogleAuthUrl()}}>Login With Google</button>
        </form>
    </div>
  )
}

export default Signin