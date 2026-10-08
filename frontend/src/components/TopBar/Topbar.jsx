import './Topbar.css';
import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass,faBars,faXmark,faBell} from '@fortawesome/free-solid-svg-icons';
import userimg from './user.png';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Topbar = () => {
  const [ham_icon,setham_icon]=useState(faBars);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const Sidebar=document.getElementById('Sidebar');
  const mainElement=document.querySelector('.mainelement');
  const messages=document.querySelector("#messages");
  const location = useLocation();
  const opensidebar=()=>{
    if(Sidebar)Sidebar.style.setProperty('width','100%','important')
    console.log(mainElement)
    if (mainElement) mainElement.style.setProperty('width','0%','important');
    if (messages) messages.style.setProperty('width','0%','important')

  }
  const closesidebar=()=>{

    if(Sidebar)Sidebar.style.setProperty('width','0%','important')
    if (mainElement) mainElement.style.setProperty('width','100%','important')
      if (messages) messages.style.setProperty('width','100%','important')
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
  const {unreadCount} = useSelector(state=>state.notifications);
  
  // Track mobile viewport
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 750);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //close sidebar everytime routes changes
  useEffect(()=>{
    if(ham_icon==faXmark) setham_icon(faBars);

    if(window.innerWidth<650)closesidebar();
  },[location.pathname])
  return (
    <div id="topbar">
        <h3 id="logo">Snaply</h3>
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
            <Link to={`/profile?email=${encodeURIComponent(profile?.email||'')}`} title="Your profile">
              <img src={profile?.pfp||userimg} alt="profile pic" />
            </Link>
            <Link to="/notifications" style={{position: 'relative', marginLeft: '0.5rem', textDecoration: 'none', color: 'inherit'}}>
              <FontAwesomeIcon icon={faBell} style={{fontSize: '1.3rem', cursor: 'pointer'}} />
              {unreadCount > 0 && (
                <span className="notification-badge" style={{top: '-0.25rem', right: '-0.25rem', transform: 'none', fontSize: '0.65rem', minWidth: '1rem', height: '1rem', lineHeight: '1rem'}}>{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </Link>
            <div style={{position: 'relative', marginLeft: '0.5rem'}}>
              <FontAwesomeIcon icon={ham_icon} id='hamburger_icon' onClick={toggle_sidebar} style={{fontSize: '1.5rem', cursor: 'pointer'}} />
              {unreadCount > 0 && isMobile && (
                <span className="notification-badge" style={{top: '-0.3rem', right: '-0.3rem', transform: 'none', fontSize: '0.6rem', minWidth: '0.9rem', height: '0.9rem', lineHeight: '0.9rem', background: 'var(--md-error)', color: 'var(--md-on-error)', borderRadius: '50%'}}>{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </div>
        </div>
        </>):null

        }
    </div>
  )
}

export default Topbar