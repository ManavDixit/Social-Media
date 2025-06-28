import React,{useEffect} from 'react'
import { useSearchParams ,useNavigate,Link} from 'react-router-dom';
import {sendGoogleCodeToServer} from '../../extraFunctions/googleLogin'
import { useDispatch } from 'react-redux';
import { setAlert } from '../../Reducers/Alert';
const GoogleAuth = ({setUserData}) => {
    const env = import.meta.env;
    const dispatch=useDispatch();
    let [searchParams, setSearchParams] = useSearchParams();
    const code=searchParams.get('code');

    const navigate=useNavigate();
    useEffect(()=>{
       sendGoogleCodeToServer(code).then(async (data)=>{
        
       if(data.success){
        localStorage.setItem('token',data.token);
        dispatch(setAlert({
          message:"Logged in successfuly" ,
          type:'success'
        }));
        await setUserData();
        navigate('/')
       }
       else{
        console.log(data.error);
       }
       })
    },[])
  return (
    <>
    
    <h2>you will be redirected to home screen soon</h2>
    <Link to="/" >Go to home</Link>
    </>
  )
}

export default GoogleAuth;