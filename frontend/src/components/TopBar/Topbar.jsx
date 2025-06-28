import './Topbar.css';
import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass,faBars,faXmark} from '@fortawesome/free-solid-svg-icons';
import userimg from './user.png';
import { useSelector } from 'react-redux';
const Topbar = () => {
  const [ham_icon,setham_icon]=useState(faBars);
  const Sidebar=document.getElementById('Sidebar');
  const mainElement=document.querySelector('.mainelement');
  const opensidebar=()=>{
    if(Sidebar)Sidebar.style.setProperty('width','100%','important')
    console.log(mainElement)
    if (mainElement) mainElement.style.setProperty('width','0%','important')

  }
  const closesidebar=()=>{

    if(Sidebar)Sidebar.style.setProperty('width','0%','important')
    if (mainElement) mainElement.style.setProperty('width','100%','important')
  }
  const toggle_sidebar=(e)=>{
    if(ham_icon==faBars) setham_icon(faXmark);
    else setham_icon(faBars);
    if(Sidebar && Sidebar.style.width!=='100%'){
      opensidebar();
    }
    else{
      closesidebar();
    }
  }
  const token=localStorage.getItem('token');
  const {profile}=useSelector(state=>state);
  //close sidebar everytime routes changes
  useEffect(()=>{
    if(ham_icon==faXmark) setham_icon(faBars);

    if(window.innerWidth<650)closesidebar();
  },[location.pathname])
  return (
    <div id="topbar">
        <h3 id="logo">Logo</h3>
        {token?(
        <>
        <div id="search">
        <FontAwesomeIcon icon={faMagnifyingGlass}/>
            <input type="text" placeholder="Search Post"/>
        </div>
        
        <div id="user">
            <button onClick={()=>{
               document.getElementById('CreatePost').style.display='flex';
            }}>Create</button>
            <img src={profile?.pfp||userimg} alt="profile pic" />
            <FontAwesomeIcon icon={ham_icon} id='hamburger_icon' onClick={toggle_sidebar}/>
        </div>
        </>):null

        }
    </div>
  )
}

export default Topbar