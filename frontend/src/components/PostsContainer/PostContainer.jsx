import Post from "../Post/Post.jsx";
import "./PostContainer.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../../api/posts.js";
import { clearPosts } from "../../Reducers/Posts.js";
import { useNavigate,createSearchParams } from "react-router-dom";
import spinner from "../../assets/spinner.svg";
const PostContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { posts } = useSelector((state) => state);
  if (posts.error) console.log(posts.error);
  //useeffect on mount
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    if(page==1) dispatch(clearPosts())
    dispatch(getPosts({ navigate, dispatch, signal, page })).then(() => {
      setIsLoading(false);
    });
    return ()=>{
     controller.abort();
    }
  }, [page]);
  const hasPosts = posts.posts.length;
  const observer=useRef(null);
  const lastelement=useCallback((element)=>{
   if(observer.current) observer.current.disconnect();
   observer.current=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting && !isLoading && posts.isNextAvailable){
      setPage(page=>page+1);
    }
   },{})
   if(element) observer.current.observe(element)
  },[posts.posts,isLoading,page])

//function to handle Click On Post
const handleClickOnPost=(postid)=>{
navigate({
  pathname: "/postinfo",
  search: createSearchParams({
      postid
  }).toString()
})
}
  return (
    <div id="PostContainer">
      {hasPosts ? (
        posts.posts.map((post,index) => {
          if(index===posts.posts.length-1){
            return <Post
            onClick={()=>{handleClickOnPost(post._id)}}
            key={post._id}
            title={post.title}
            description={post.description}
            likeCount={5}
            postimg={post.image}
            postvideo={post.video}
            hasLiked={post.hasLiked}
            postid={post._id}
            ref={lastelement}
            userName={post.user}
            email={post.email}
            />
          }
          else{
            return <Post
            onClick={()=>{handleClickOnPost(post._id)}}
            key={post._id}
            title={post.title}
            description={post.description}
            likeCount={5}
            postimg={post.image}
            postvideo={post.video}
            hasLiked={post.hasLiked}
            postid={post._id}
            userName={post.user}
            email={post.email}
            />
          }
        })
        ) : (
          <h1>Nothing here yet.</h1>
          )}
          {isLoading && <img className="spinner" src={spinner} alt="Loading...." />}
    </div>
  );
};

export default PostContainer;
