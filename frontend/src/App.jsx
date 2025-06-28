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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Verify from "./components/verify/Verify";
import CreatePost from "./components/CreatePost/CreatePost";
import PostInfo from "./components/PostInfo/PostInfo";
import Profile from "./components/Profile/Profile";

import Sidebar from "./components/Sidebar/Sidebar";
import Notifications from "./components/Notifications/Notifications";
import MainElement from "./MainElement";
import { getProfile} from "./api/Profile";
import { setProfile } from "./Reducers/Profile";
function App() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const { alert } = useSelector((state) => state);
  const token = localStorage.getItem("token");
  const setUserData=async ()=>{
    const userData=await getProfile({email:'',dispatch,navigate});
        if(userData.isMyProfile) dispatch(setProfile(userData));
  }
  useEffect(() => {
    (async ()=>{
      
      console.log(token);
      if(token){
        setUserData();
      }
    })()
  }, []);
  
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
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/postInfo" element={<PostInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/register" element={<Signup  />} />
          <Route path="/login" element={<Signin setUserData={setUserData}/>} />
          <Route path="/auth/google" element={<GoogleAuth setUserData={setUserData} />} />
          <Route path="/verify" element={<Verify setUserData={setUserData} />} />
        </Routes>
        <Notifications />
      </div>
    </div>
  );
}

export default App;
