import React,{useState} from 'react';
import './Signup.css';
import {getGoogleAuthUrl} from '../../extraFunctions/googleLogin';
import {validateName,validateEmail,validatePassword} from '../../extraFunctions/validate';
import {signUp} from '../../api/auth';
import {useDispatch} from 'react-redux';
import { handleInputChange } from '../../extraFunctions/common';
import { useNavigate , Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/>
    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
  </svg>
);

const Signup = ({setUserData}) => {
  const dispatch=useDispatch();
  const [info,setInfo]=useState({
    name:'',email:'',password:'',confirmPassword:''
  });
  const token=localStorage.getItem('token');
  useEffect(()=>{
    if (token )navigate('/')
  },[])
 const navigate=useNavigate();
  const validate=()=>{
    setInfo({...info,name:info.name.trim(),email:info.email.trim(),password:info.password.trim(),confirmPassword:info.confirmPassword.trim()});
    const signup_name_validate_text=document.getElementById('signup_name_validate_text');
    const signup_email_validate_text=document.getElementById('signup_email_validate_text');
    const signup_password_validate_text=document.getElementById('signup_password_validate_text');
    const signup_confirmPassword_validate_text=document.getElementById('signup_confirmPassword_validate_text');
    signup_name_validate_text.style.visibility='hidden';
    signup_email_validate_text.style.visibility='hidden';
    signup_password_validate_text.style.visibility='hidden';
    signup_confirmPassword_validate_text.style.visibility='hidden';
    if(!validateName(info.name)){
      
      signup_name_validate_text.style.visibility='visible';
      console.log('name must be within 3 to 12 characters')
      
    }
    if(!validateEmail(info.email)){
      
      signup_email_validate_text.style.visibility='visible';
    }
    if(!validatePassword(info.password)){
      
      signup_password_validate_text.style.visibility='visible';
    }
    if(!validatePassword(info.confirmPassword)){
      signup_confirmPassword_validate_text.innerText='confirm password must be between 8 to 12 character'
      signup_confirmPassword_validate_text.style.visibility='visible';
      console.log('confirm password must be between 8 to 12 character')
    }
    if(info.password!==info.confirmPassword){
      signup_confirmPassword_validate_text.innerText='password and confirm passwowrd must match'
      signup_confirmPassword_validate_text.style.visibility='visible';
      console.log('password and confirm passwowrd must match')
    }
    if(validateName(info.name) && validateEmail(info.email) && validatePassword(info.password) && validatePassword(info.confirmPassword) && info.password===info.confirmPassword){
      
      signUp(info,dispatch,navigate);
    }
    
  }
  //function to show/hide password in input for password
  const [eyeIconForPassword,setEyeIconForPassword]=useState(faEye);
  const handleHideShowPassword=(e)=>{
    const input=document.getElementById('password');
    if(eyeIconForPassword===faEye) {

      setEyeIconForPassword(faEyeSlash)
    }else{
      setEyeIconForPassword(faEye)
    }
    if(input.type==='password'){
      input.type='text'
    }else{
      input.type='password';
    }
  }
  //function to show/hide password in input for confirm password
  const [eyeIconForConfirmPassword,setEyeIconForConfirmPassword]=useState(faEye);
  const handleHideShowConfirmPassword=()=>{
    const input=document.getElementById('confirmPassword');
    if(eyeIconForConfirmPassword===faEye) {

      setEyeIconForConfirmPassword(faEyeSlash)
    }else{
      setEyeIconForConfirmPassword(faEye)
    }
    if(input.type==='password'){
      input.type='text'
    }else{
      input.type='password';
    }
  }
  return (
    <div id='signup'>
      <div className='auth-card'>
        <aside className='auth-panel'>
          <p className='auth-panel-title'>Your people are already here.</p>
          <p className='auth-panel-text'>Create an account and start posting in a minute.</p>
        </aside>
        <form action="">
            <h1>Create Account</h1>
            <input type="text" name='name' id='name' placeholder='Name' autoComplete='name' value={info.name} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <p id='signup_name_validate_text' className='validate'>name must be within 3 to 10 characters</p>
            <input type="email" name='email' id='email' placeholder='Email' autoComplete='email' value={info.email} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <p id='signup_email_validate_text' className='validate'>Enter a valid email</p>
            <div className="password-field">
              <input type="password" name='password' id='password' placeholder='Password' autoComplete='new-password' value={info.password} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
              <FontAwesomeIcon icon={eyeIconForPassword} onClick={handleHideShowPassword}/>
            </div>
            <p id='signup_password_validate_text' className='validate'>password must be between 8 to 12 character</p>
            <div className="password-field">
              <input type="password" name='confirmPassword' id='confirmPassword' placeholder='Confirm Password' autoComplete='new-password' value={info.confirmPassword} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
              <FontAwesomeIcon icon={eyeIconForConfirmPassword} onClick={handleHideShowConfirmPassword}/>
            </div>
            <p id='signup_confirmPassword_validate_text' className='validate'>confirm password must be between 8 to 12 character</p>
            <Link to='/login'>Login to existing account</Link>
            <button className='primary-btn' onClick={(e)=>{e.preventDefault();validate();}}>Create Account</button>
            <p className='divider'>or</p>
            <button className='google-btn' onClick={(e)=>{e.preventDefault();window.location=getGoogleAuthUrl()}}><GoogleIcon/>Signup With Google</button>
        </form>
      </div>
    </div>
  )
}

export default Signup
