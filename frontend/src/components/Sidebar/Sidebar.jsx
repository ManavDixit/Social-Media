import './Sidebar.css';
import React from 'react'
import userimg from '../TopBar/user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faMessage,faBell,faUser} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Sidebar = () => {
  const token=localStorage.getItem('token');
  const {profile}=useSelector(state=>state);
  return (
    <div id='Sidebar' style={{display:!token?'none':'flex'}}>
      <ul>
        <li><FontAwesomeIcon icon={faHouse}/><Link to="/">Home</Link></li>
        <li><FontAwesomeIcon icon={faMessage}/><Link to="">Messages</Link></li>
        <li><FontAwesomeIcon icon={faBell}/><Link to="/">Notifications</Link></li>
        <li><FontAwesomeIcon icon={faUser}/><Link to={`/profile?email=${profile.email}`}>Profile</Link></li>
      </ul>
      <div className="others">
            <img src={profile?.pfp||userimg} alt="profile pic" />
            <button  onClick={()=>{
              document.getElementById('CreatePost').style.display='flex';
            }}>Create</button>
      </div>
    </div>
  )
}

export default Sidebar