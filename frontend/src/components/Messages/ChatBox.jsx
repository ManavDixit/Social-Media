// @ts-check
// @ts-nocheck
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/Profile";
import { getMessages ,sendMessage} from "../../api/Messages";
import spinner from "../../assets/spinner.svg";
import { socket } from "../../socket";
import { setMessages ,clearMessages,setActiveEmail} from "../../Reducers/Messages";
import { use } from "react";
export const ChatBox = () => {
  let { email } = useParams();
  const navigate = useNavigate();
  //profile data of reciver of chat
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageCreatedAt,setLastMessageCreatedAt]=useState(null);

  //page
  const [page, setPage] = useState(1);
  let dispatch = useDispatch();
  //messages and profile info of logged in user
  const { messages, profile} = useSelector((state) => state);

  //state for message box(input)
  const [mssgInput,setMssgInput]=useState("");

  //reciving message websocket event handler
  const messageReceivedHandler=useCallback((message)=>{
    if(message.from!==email)return;//message not for this chatbox
    dispatch(setMessages(message));
  },[email,dispatch]);



//getting reviers data
  useEffect(() => {
    (async () => {
      
      const userData = await getProfile({ email, dispatch, navigate });

      setUserData({ email: userData.email, name: userData.name });
    })();
  }, [email]);

  //socket handler
  useEffect(()=>{
    socket.on("messageReceived",messageReceivedHandler);
    return () => {
      socket.off("messageReceived",messageReceivedHandler);
    };
  },[])

  //clearing messages on leaving message page
  const didMountRef = useRef(false);

useEffect(() => {
  return () => {
    if (!didMountRef.current) {
      // ignore StrictMode fake unmount
      didMountRef.current = true;
      return;
    }

    // real page exit
    dispatch(clearMessages());
    dispatch(setActiveEmail(null));
    setLastMessageCreatedAt(null);
  };
}, []);

//getting initial messages
/** @type {import('react').RefObject<HTMLDivElement>} */
const containerRef=useRef();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    const prevHeight = containerRef.current?.scrollHeight ?? 0;
    (async ()=>{

      dispatch(setActiveEmail(email));
      await dispatch(getMessages({ dispatch, signal, to: email})).then(() => {
        setIsLoading(false);
      }).then(()=>{
  
        containerRef.current.scrollTop=containerRef.current.scrollHeight-prevHeight;
      })
    })();
    
    return () => {
      controller.abort();
    };
  }, [email]);

//getting pagination messages
/** @type {import('react').RefObject<HTMLDivElement>} */
  useEffect(() => {
    if(lastMessageCreatedAt===null) return;//initial load handled in prev useEffect
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    const prevHeight = containerRef.current?.scrollHeight ?? 0;
    dispatch(getMessages({ dispatch, signal, to: email ,lastMessageCreatedAt})).then(() => {
      setIsLoading(false);
    }).then(()=>{

      containerRef.current.scrollTop=containerRef.current.scrollHeight-prevHeight;
    })
    
    return () => {
      controller.abort();
    };
  }, [lastMessageCreatedAt]);


  // handling sending message button
  const sendMessageButton=()=>{
    sendMessage({message:mssgInput,from:profile.email,to:userData.email,dispatch});
    setMssgInput("");
  }

  //pagination
  const observer=useRef();
  const firstElement=useCallback((element)=>{//will be runned when elemnt eith this func in ref is rendered
    if(observer.current) observer.current.disconnect();
    observer.current=new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && !isLoading && messages.isNextAvailable){
        console.log("firstttt");
        setLastMessageCreatedAt(messages.messages[0].createdAt);
      }
    },{});
    if(element) observer.current.observe(element);
  },[messages.messages,isLoading,lastMessageCreatedAt]);
  //handling auto scrolling
  const bottomRef=useRef();

  const isAtBottomRef=useRef(true);
  useEffect(()=>{

    if(bottomRef.current && isAtBottomRef.current) bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    
  },[messages.messages]);

//importing typw just to get vscode sugggestions, remove later
  /**
 * @param {import('react').UIEvent<HTMLDivElement>} event
 */
  const handleScroll=(event)=>{
    const threshold=200;//px
    const element=event.currentTarget;
    //bottom length below screen <threshold (scroll height=toatral height , visible +to overflow+bottom overfloe ; client heightis veible height, scrollTop is top overflow)
    isAtBottomRef.current=element.scrollHeight-element.clientHeight-element.scrollTop<threshold;
  }

  return (
   
    <div className="chat" >
      <div className="reciverInfo">
        <h3>{userData.name}</h3>
      </div>

      {messages.messages.length>0 ? (
        <>
          <div  className="chatbox" onScroll={handleScroll} ref={containerRef}>
            {isLoading && (
              <img className="spinner" src={spinner} alt="Loading...." />
            )}
            {messages.messages.map((message,index) => {
              if (message.from ==email) {
                if(index==0){
                  
                  return (
                    
                    <div className="recivedMessage" ref={firstElement} key={message._id}>
                      <h4>{userData.name}</h4>
                      <p>{message.message}</p>
                    </div>
                  );
                }else{
                  return (
                    
                    <div className="recivedMessage"  key={message._id}>
                      <h4>{userData.name}</h4>
                      <p>{message.message}</p>
                    </div>
                  );
                }
              } else {
                if(index==0){
                  return (
                    <div className="sentMessage" ref={firstElement} key={message._id}>
                      <h4>{profile.name} (YOU)</h4>
                      <p>{message.message}</p>
                    </div>
                  );
                }
                else{

                  return (
                    <div className="sentMessage" key={message._id}>
                      <h4>{profile.name} (YOU)</h4>
                      <p>{message.message}</p>
                    </div>
                  );
                }
              }
            })}
            <p ref={bottomRef}></p>
          </div>
        </>
      ) : (
        <div className="chatbox" ref={containerRef}>
          {isLoading && (
            <img className="spinner" src={spinner} alt="Loading...." />
          )}
          <h1>Nothing here yet.</h1>
        </div>
      )}

      <div className="textbox">
        <input type="text" value={mssgInput} className="messageBox" placeholder="Type Here ..." onChange={(e)=>{
            setMssgInput(e.target.value);
        }}/>
        <button onClick={sendMessageButton}>SEND</button>
      </div>
    </div>
  );
};
