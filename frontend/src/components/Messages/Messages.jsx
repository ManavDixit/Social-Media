import "./Messages.css";
import { socket } from "../../socket.js";
import {Link, Outlet,useParams} from 'react-router-dom';
import { useEffect, useState} from "react";
import {useDispatch} from 'react-redux';
import { getContacts } from "../../api/Messages.js";
import { useNavigate } from "react-router-dom";
import { ChatBox } from "./ChatBox.jsx";
const messages=()=>{
    let { email } = useParams();
    const navigate = useNavigate();
    const [contacts,setContacts]=useState([]);
    let dispatch=useDispatch();
    useEffect(()=>{
        (async()=>{

            const data=await getContacts({dispatch});
            setContacts(data);
            console.log(data);
        })();
    },[]);


      const [isMobile,setIsMobile]=useState(window.innerWidth<=400);
          //handling resize
          useEffect(()=>{  
            const handleResize=()=>{
              setIsMobile(window.innerWidth<=400);
            }       
            
            window.addEventListener('resize',handleResize);
            return ()=>{
              window.removeEventListener('resize',handleResize);
            }   
          },[]);
return (
    <div id="messages">
        {
            isMobile && email ? null:(
        <div className="contacts">
            <h1>Contacts</h1>
            {
                contacts.map((user)=><div key={user.email} onClick={()=>navigate(`/messages/${user.email}`)}>{user?.name}</div>)
            }
        </div>)
        }
        <Outlet/>
    </div>
)
}
export default messages;