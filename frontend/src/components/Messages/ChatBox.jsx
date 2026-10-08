// @ts-check
// @ts-nocheck
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/Profile";
import { getMessages ,sendMessage} from "../../api/Messages";
import { markNotificationRead } from "../../api/Notifications";
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
  const { messages, profile, notifications } = useSelector((state) => state);

  //state for message box(input)
  const [mssgInput,setMssgInput]=useState("");

  //reciving message websocket event handler
  const emailRef = useRef(email);
  emailRef.current = email;

  const messageReceivedHandler=useCallback((message)=>{
    if(message.from!==emailRef.current)return;//message not for this chatbox
    dispatch(setMessages(message));
  },[dispatch]);


//getting reviers data
  useEffect(() => {
    dispatch(clearMessages());
    setLastMessageCreatedAt(null);
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
    if(mssgInput.trim()==='') return;
    sendMessage({message:mssgInput,from:profile.email,to:userData.email,dispatch});
    setMssgInput("");
  }

  //pagination - observe the first element (oldest message) to load more when scrolled to top
  const observer=useRef();
  const firstElement=useCallback((element)=>{//will be runned when element with this func in ref is rendered
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

  // messageSeen: observe received messages entering viewport
  const messageRefs = useRef({});
  const seenObserver = useRef();
  useEffect(() => {
    seenObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            if (messageId) {
              socket.emit("messageSeen", { messageId, chatWith: profile.email });
              // stop observing this message
              seenObserver.current.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    return () => seenObserver.current?.disconnect();
  }, [profile.email]);

  // Combined ref callback for received messages - handles both pagination (first element) and messageSeen
  const receivedMessageRef = useCallback((el) => {
    if (!el) return;
    const messageId = el.dataset.messageId;
    if (messageId) {
      messageRefs.current[messageId] = el;
      seenObserver.current?.observe(el);
    }
  }, []);

  // observe received messages after render
  useEffect(() => {
    Object.values(messageRefs.current).forEach((el) => {
      if (el) seenObserver.current?.observe(el);
    });
  }, [messages.messages]);

  // Mark message notifications from this sender as read when chat opens
  useEffect(() => {
    if (!notifications?.items) return;
    const unreadFromSender = notifications.items.filter(n => 
      n.type === 'message' && 
      !n.read && 
      n.sender?.email === email
    );
    unreadFromSender.forEach(n => {
      dispatch(markNotificationRead({ notificationId: n._id }));
    });
  }, [email, notifications?.items, dispatch]);

  return (
   
    <div className="chat" >
      <div className="reciverInfo">
        <h3 title="View profile" onClick={()=>{navigate(`/profile?email=${encodeURIComponent(email)}`)}}>{userData.name}</h3>
      </div>

      {messages.messages.length>0 ? (
        <>
          <div  className="chatbox" onScroll={handleScroll} ref={containerRef}>
            {isLoading && (
              <img className="spinner" src={spinner} alt="Loading...." />
            )}
            {messages.messages.map((message,index) => {
              const isReceived = message.from === email;
              // Attach pagination observer to the FIRST message in the list (oldest)
              const shouldAttachPagination = index === 0;
              if (isReceived) {
                return (
                  <div 
                    className="recivedMessage" 
                    ref={shouldAttachPagination ? (el) => { firstElement(el); receivedMessageRef(el); } : receivedMessageRef}
                    key={message._id}
                    data-message-id={message._id}
                  >
                    <h4>{userData.name}</h4>
                    <p>{message.message}</p>
                  </div>
                );
              } else {
                return (
                  <div 
                    className="sentMessage" 
                    ref={shouldAttachPagination ? firstElement : null}
                    key={message._id}
                  >
                    <h4>{profile.name} (YOU)</h4>
                    <p>{message.message}</p>
                  </div>
                );
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
        }} onKeyDown={(e)=>{
            //Enter sends the message (not while an IME is composing, and never a blank message)
            if(e.key==='Enter' && !e.nativeEvent.isComposing){
              e.preventDefault();
              if(mssgInput.trim()!=='') sendMessageButton();
            }
        }}/> 
        <button onClick={sendMessageButton} disabled={mssgInput.trim()===''}>SEND</button>
      </div>
    </div>
  );
};