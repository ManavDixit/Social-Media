import React,{useEffect} from 'react'
import './Alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { clearAlert } from '../../Reducers/Alert';
import { useDispatch } from 'react-redux';

const Alert = () => {
    useEffect(()=>{
        setTimeout(()=>{
            dispatch(clearAlert());
        },5000)
    },[])
    const dispatch=useDispatch();
    const {alert}=useSelector(state=>state);
    
  return (
    <div id='alert' style={{display:alert.message?'flex':'none',background:`var(--alert-${alert.type})`}}>
        <p>
            {alert.message}
        </p>
        <FontAwesomeIcon icon={faXmark} onClick={()=>{dispatch(clearAlert())}}/>
        </div>
  )
}

export default Alert