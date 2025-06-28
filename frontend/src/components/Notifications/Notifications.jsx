import './Notifications.css';
import React from 'react'

const Notifications = () => {
  const token=localStorage.getItem('token')
  return (
    <div id='Notifications' style={{display:!token?'none':'block'}} >
      <div id="notificationBox">
        <h2>Notifications</h2>
        <p>Message from Manav</p>
        <p>Manav liked your post</p>
        <p>Message from Manav</p>
        <p>Manav liked your post</p>
        <p>Message from Manav</p>
        <p>Manav liked your post</p>
        <p>Manav liked your post</p>
      </div>
    </div>
  )
}

export default Notifications