import { io } from 'socket.io-client';


const URL ="http://localhost:4000";
const token=localStorage.getItem("token");
export const socket = io(URL,{
    autoConnect: false,
        auth:{token}
});

