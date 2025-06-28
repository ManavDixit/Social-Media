export  const handleInputChange=(e,data,setData)=>{
    setData({...data,[e.target.name]:e.target.value})
  };