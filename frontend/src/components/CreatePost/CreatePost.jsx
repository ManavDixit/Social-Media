import "./CreatePost.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faLink } from "@fortawesome/free-solid-svg-icons";
import { handleInputChange } from "../../extraFunctions/common";
import { createPost } from "../../api/posts";
import {useDispatch} from 'react-redux';
import spinner from '../../assets/spinner.svg'
const CreatePost = () => {
  const dispatch=useDispatch();
  const [data, setData] = useState({
    title: "",
    description: "",
    attachment: null,
  });
  const [isLoading,setIsLoading]=useState(false);
  const [fileName,setFileName]=useState('');
  //function to handle file: runs on onchange on input:file
  const handleFile = (e) => {
    const file = e.target.files[0];
  
   setData({...data,attachment:file});
   setFileName(file.name)
  };
  //function to clear value of file type input
  const clearInput=()=>{
   
    const fileInput=document.getElementById('attachment');
    fileInput.value='';
    setFileName('');
    setData({
      title: "",
      description: "",
      attachment: null,
    })
  }
  return (
    <div id="CreatePost">
      <FontAwesomeIcon
        icon={faXmark}
        className="close"
        onClick={() => {
          document.getElementById("CreatePost").style.display = "none";
        }}
      />
      <form>
        <div>
          <h1>Create Post</h1>
        </div>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          value={data.title}
          onChange={(e) => {
            handleInputChange(e, data, setData);
          }}
        />
        <textarea
          type="text"
          name="description"
          id="description"
          placeholder="Body"
          value={data.description}
          onChange={(e) => {
            handleInputChange(e, data, setData);
          }}
        />
        <div>
          <input
            accept="image/*,video/*"
            type="file"
            name="attachment"
            id="attachment"
            onChange={handleFile}
          />
          <FontAwesomeIcon
            icon={faLink}
            id="linkFile"
            onClick={() => {
              document.getElementById("attachment").click();
            }}
          />
          <p>{fileName}</p>
        </div>
        <button
          onClick={(e) => {
           e.preventDefault();
           setIsLoading(true)
           clearInput();
            createPost({
              title: data.title,
              description: data.description,
              attachment: data.attachment,
              dispatch
            }).then(()=>{
              setIsLoading(false)
            })
          }}
        >
          POST
        </button>
        {
        isLoading &&
      <img className='spinner' src={spinner} alt="Loading...." />
      }
      </form>
    </div>
  );
};

export default CreatePost;
