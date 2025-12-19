import { Server } from "socket.io";
import { authenticate } from "../middleware/auth.js";
import Users from "../models/Auth.js";
import { sendMessage } from "../controllers/Messages.js";
let io;
export const connectToWebSocket = (frontendUrl, server) => {
  io = new Server(server, {
    cors: {
      origin: frontendUrl,
    },
  });

  
  //authenticating user
  io.use((socket, next) => {
    //creating req and res for autheticate middleware
    const req = {
      headers: {
        token:socket.handshake.auth.token
      }
    };
    //authenticate middleware will call res.status(400).send({sucess:false,error:error})
    const res = {
      status: (statusCode) => ({
        send: (error) => next(new Error(error.error)), //passing error stops and emits connect_error event to user
      }),
    };
    authenticate(req, res, async () => {
      const user=await Users.findOne({email:req.email});
      socket.user=user;
      console.log(socket.user);
      next();//allow connection
    });
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.join(socket.user?.email);
  });
  
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call connectToWebSocket first.");
  }
  return io;
};