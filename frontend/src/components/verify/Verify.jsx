import React from 'react'
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { verifyUser } from '../../api/auth';
import {useDispatch} from 'react-redux'
const Verify = ({setUserData}) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const token=searchParams.get('token');
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
      const controller=new AbortController();
      const signal=controller.signal;
        verifyUser(token,navigate,dispatch,signal,setUserData);
       
        return ()=>{controller.abort()}
    },[])
  return (
    <div>
    { 

      token? <h3>You will be redirected to /login soon. Singnup again to if verification failed</h3>
      : <h3>Invalid verify link</h3>
    }
    </div>
  )
}

export default Verify