const env = import.meta.env;
import queryString from "query-string";
export const getGoogleAuthUrl = () => {
  const baseUrl = "https://accounts.google.com/o/oauth2/auth";
  const options = {
    redirect_uri: `${env.VITE_GOOGLE_REDIRECT_URI}`,
    client_id: env.VITE_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${baseUrl}?${queryString.stringify(options)}`;
};
export const sendGoogleCodeToServer=async (code)=>{
  const response=await fetch(`${env.VITE_SERVER_URL}/auth/google`,
        {
            method:'post',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({code})
        });
        const data=await response.json();
        return data;
}