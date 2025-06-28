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
        <form action="">
            <h1>Create Account</h1>
            <input type="text" name='name' id='name' placeholder='Name' value={info.name} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <p id='signup_name_validate_text' className='validate'>name must be within 3 to 10 characters</p>
            <input type="email" name='email' id='email' placeholder='Email' value={info.email} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <p id='signup_email_validate_text' className='validate'>Enter a valid email</p>
            <div id="signuppasswordInputContainer">

            <input type="password" name='password' id='password' placeholder='Password' value={info.password} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <FontAwesomeIcon icon={eyeIconForPassword} onClick={handleHideShowPassword}/>
            </div>
          
            <p id='signup_password_validate_text' className='validate'>password must be between 8 to 12 character</p>
            <div id="signuppasswordInputContainer">

            <input type="password" name='confirmPassword' id='confirmPassword' placeholder='Confirm Password' value={info.confirmPassword} onChange={(e)=>{handleInputChange(e,info,setInfo)}}/>
            <FontAwesomeIcon icon={eyeIconForConfirmPassword} onClick={handleHideShowConfirmPassword}/>
            </div>
           
            <p id='signup_confirmPassword_validate_text' className='validate'>confirm password must be between 8 to 12 character</p>
            <Link to='/login'>Login to existing account</Link>
            <button onClick={(e)=>{e.preventDefault();validate();}}>Create Account</button>
            <p>-OR-</p>
            <button onClick={(e)=>{e.preventDefault();window.location=getGoogleAuthUrl()}}>Signup With Google</button>
        </form>
    </div>
  )
}

export default Signup