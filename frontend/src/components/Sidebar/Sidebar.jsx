import './Sidebar.css';
import React from 'react'
import userimg from '../TopBar/user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faMessage,faBell,faUser} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
const Sidebar = () => {
  const token=localStorage.getItem('token');
  const {profile}=useSelector(state=>state);
  const {unreadCount} = useSelector(state=>state.notifications);
  const location = useLocation();
  const isNotificationsPage = location.pathname === '/notifications';
  return (
    <div id='Sidebar' style={{display:!token?'none':'flex'}}>
      <ul>
        <li><FontAwesomeIcon icon={faHouse}/><Link to="/">Home</Link></li>
        <li>
          <FontAwesomeIcon icon={faMessage}/>
          <Link to="/messages">Messages</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faBell}/>
          <Link to="/notifications">Notifications</Link>
          {unreadCount > 0 && !isNotificationsPage && (
            <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </li>
        <li><FontAwesomeIcon icon={faUser}/><Link to={`/profile?email=${profile.email}`}>Profile</Link></li>
      </ul>
      <div className="others">
        <Link to={`/profile?email=${encodeURIComponent(profile?.email||'')}`} title="Your profile">
            <img src={profile?.pfp||userimg} alt="profile pic" />
        </Link>
            <button  onClick={()=>{
              document.getElementById('CreatePost').style.display='flex';
            }}>Create</button>
      </div>
    </div>
  )
}

export default Sidebar