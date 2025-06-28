import React from 'react'
import './Posts.css';
import Post from '../../Post/Post';
import { useNavigate ,createSearchParams} from 'react-router-dom';

const Posts = ({posts}) => {
  const navigate=useNavigate();
  const handleClickOnPost=(postid)=>{
    navigate({
      pathname: "/postinfo",
      search: createSearchParams({
          postid
      }).toString()
    })
    }
  return (
    <div className='profile-postscontainer'>
      <h2>Posts:</h2>
{

      posts.map((post)=>
          <Post onClick={()=>{handleClickOnPost(post._id)}} key={post._id}title={post.title}
          description={post.description}
          likeCount={5}
          postimg={post.image}
          postvideo={post.video}
          hasLiked={post.hasLiked}
          postid={post._id}
          userName={post.user}
          email={post.email}
          />
      )
}
    </div>
  )
}

export default Posts