const env = import.meta.env;
const url = env.VITE_SERVER_URL;
import { setAlert } from "../Reducers/Alert";
export const signUp = async (
  { name, email, password, confirmPassword },
  dispatch,navigate,
) => {
  try {
    const response = await fetch(`${url}/auth/signup`, {
      method: "post",
      body: JSON.stringify({ name, email, password, confirmPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      
      dispatch(setAlert({
        message:"verification email sent, please verify to continue" ,
        type:'success'
      }))
      
    } else {
      console.log(data.error);
      dispatch(
        setAlert({
          message: `can't signup error: ${data.error}`,
          type:'error'
        })
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(setAlert({
        message: `can't signup error: ${error}`,
        type:'error'
      }))
  }
};
export const signIn = async ({ email, password }, dispatch,navigate,setUserData) => {
  try {
    const response = await fetch(`${url}/auth/signin`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      dispatch(setAlert({
          message:"Logged in successfuly" ,
          type:'success'
        }));
        await setUserData();
        navigate('/')
    } else {
      console.log(data.error);
      dispatch(
        setAlert({
          message: `can't login error: ${data.error}`,
          type:'error'
        })

      );
      
    }
  } catch (error) {
    console.log(error);
    dispatch(
        setAlert({
          message: `can't login error: ${error}`,
          type:'error'
        })
      );
  }
};

export const verifyUser=async (encryptedData,navigate,dispatch,signal,setUserData)=>{
  try{
   
    const response=await fetch(`${url}/auth/verify`,{
      signal,
      method:'post',
      body:JSON.stringify({encryptedData}),
      headers:{
        'content-type':'application/json'
      }
    })
    const data=await response.json();
    
    if (data.success) {
      localStorage.setItem("token", data.token);
      
      dispatch(setAlert({
        message:"account verified successfuly" ,
        type:'success'
      }));
      await setUserData();
      navigate('/');
    } else {
      console.log(data.error);
      dispatch(
        setAlert({
          message: `can't verify error: ${JSON.stringify(data.error)}`,
          type:'error'
        })
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(setAlert({
        message: `can't verify error: ${error}`,
        type:'error'
      }))
  }
};