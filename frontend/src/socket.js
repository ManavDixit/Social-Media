import { io } from 'socket.io-client';

const env = import.meta.env;
const url = env.VITE_SERVER_URL;
const token=localStorage.getItem("token");
export const socket = io(url,{
    autoConnect: false,
        auth:{token}
});

