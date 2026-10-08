import "./App.css";
import Topbar from "./components/TopBar/Topbar";
import Home from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Signin from "./components/signin/Signin";
import GoogleAuth from "./components/GoogleAuth/GoogleAuth";
import LandingPage from "./components/LandingPage/LandingPage";
import Alert from "./components/alert/Alert";
import { useSelector ,useDispatch} from "react-redux";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Verify from "./components/verify/Verify";
import CreatePost from "./components/CreatePost/CreatePost";
import PostInfo from "./components/PostInfo/PostInfo";
import Profile from "./components/Profile/Profile";
import Messages from "./components/Messages/Messages"
import Sidebar from "./components/Sidebar/Sidebar";
import Notifications from "./components/Notifications/Notifications";
import NotificationsPage from "./components/Notifications/NotificationsPage";
import MainElement from "./MainElement";
import { getProfile} from "./api/Profile";
import { setProfile } from "./Reducers/Profile";
import { setAlert } from "./Reducers/Alert";
import { useLocation } from "react-router-dom";

import { socket } from './socket';
import { ChatBox } from "./components/Messages/ChatBox";
import { EmptyScreen } from "./components/Messages/EmptyScreen";
import { addNotification } from "./Reducers/Notifications";
import { markNotificationRead } from "./api/Notifications";
function App() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const location=useLocation();
  const { alert } = useSelector((state) => state);
  const token = localStorage.getItem("token");
  const setUserData=async ()=>{
    const userData=await getProfile({email:'',dispatch,navigate});
        if(userData.isMyProfile) dispatch(setProfile(userData));
  }
  const locationRef = React.useRef(location);
  locationRef.current = location;

  useEffect(() => {
    //socket.io handlers
    const onConnect = () => {
      console.log("connected to websocket");
    }
  const onDisconnect = () => console.log("disconnected from websocket");
  const onConnectError = (err) => console.error("Connection failed:", err.message);
    (async ()=>{
      
      console.log(token);
      if(token){
        setUserData();
      }
    })();
  //socket.io event listners
  //If token present, update auth + connect
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
       socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("connect_error", onConnectError);
  
  // notification socket event
  const onNotification = (data) => {
    if (data?.notification) {
      const notification = data.notification;
      // Always add notification to Redux
      dispatch(addNotification(notification));
      
      // For message notifications, check if we're in that chat
      if (notification.type === 'message' && notification.sender?.email) {
        const currentPath = locationRef.current.pathname;
        const inThatChat = currentPath === `/messages/${notification.sender.email}`;
        
        if (inThatChat) {
          // In the chat - immediately mark as read (no toast, no unread badge)
          dispatch(markNotificationRead({ notificationId: notification._id }));
        } else {
          // Not in chat - show toast
          dispatch(setAlert({ message: `New message from ${notification.sender.name || 'Someone'}`, type: 'info' }));
        }
      } else {
        // Non-message notifications (like, comment, follow) - show toast
        dispatch(setAlert({ message: `New ${notification.type} from ${notification.sender?.name || 'Someone'}`, type: 'info' }));
      }
    }
  };
  socket.on("notification", onNotification);
  
  // messageSeen socket event (for sender to update UI)
  const onMessageSeen = (data) => {
    console.log("messageSeen:", data);
    // Could update message status in Redux here if needed
  };
  socket.on("messageSeen", onMessageSeen);

    // Cleanup (avoids multiple event listners)
  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("connect_error", onConnectError);
    socket.off("notification", onNotification);
    socket.off("messageSeen", onMessageSeen);
    socket.disconnect();
  };
  }, [token]);
  
  return (
    <div className="App">
      <Topbar />

      <CreatePost />
      {alert.message ? <Alert /> : null}
      <div id="main">
        <Sidebar />
        <Routes>
          <Route element={<MainElement />}>
            <Route index element={<Home />} />
            <Route path="postInfo" element={<PostInfo />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/postInfo" element={<PostInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/register" element={<Signup  />} />
          <Route path="/login" element={<Signin setUserData={setUserData}/>} />
          <Route path="/auth/google" element={<GoogleAuth setUserData={setUserData} />} />
          <Route path="/verify" element={<Verify setUserData={setUserData} />} />
            <Route path="/messages" element={<Messages/>}>
            <Route index element={<EmptyScreen />} />     // when no chat selected
      <Route path=":email" element={<ChatBox />} />

            </Route>
          
        </Routes>

         {/* only show Notifications if not on /messages or /notifications */}
      {!location.pathname.startsWith("/messages") && !location.pathname.startsWith("/notifications") && <Notifications />}

      </div>
    </div>
  );
}

export default App;