import express from "express";
import { upload } from "../middleware/Posts.js";
const Router=express.Router()
import {getAllPost,CreateNewPost,likePost,getPostInfo,uploadToCloudinary} from '../controllers/Posts.js'
import {authenticate} from '../middleware/auth.js';
import paginate from '../middleware/pagination.js';
import {signuploadform} from "../middleware/uploads.js";
import Posts from "../models/Post.js";
import Comments from '../models/Commment.js';
import { addComment, getComments, likeComment } from "../controllers/Comments.js";

Router.use(authenticate);//any routes  below this wil; use this middleware
//route to fetch all post
Router.get('/',(req,res,next)=>{req.options={};next()},paginate(Posts),getAllPost);


Router.post('/createpost',CreateNewPost);
Router.get('/likePost',likePost);
Router.get('/getPostInfo',getPostInfo);
Router.post('/addcomment',addComment);
Router.get('/getcomments',(req,res,next)=>{req.options={post:req.headers.post_id};next()},paginate(Comments),getComments);
Router.get('/likecomment',likeComment);
Router.post('/uploadtocloudinary',signuploadform,uploadToCloudinary);
//route for images
// Router.get('/image',getImage)
export default Router;