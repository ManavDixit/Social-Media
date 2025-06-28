const url = import.meta.env.VITE_SERVER_URL;
export const getImage=async (src)=>{
    const token=localStorage.getItem('token');
    if(token){
        try{

            const response=await fetch(`${url}/uploads/image?src=${src}`,{headers:{
                token
            }});
            const img=await response.arrayBuffer();
            return img;
        }
        catch(error){
            console.log(error)
        }
    }
    else{
        console.log('unauthencated to veiw file')
    }
}

