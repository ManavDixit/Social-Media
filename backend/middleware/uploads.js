import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
const { CLOUDINARY_API_SECRET } = process.env;
export const signuploadform = (req,res,next) => {
  const timestamp = Math.round(Date.now()/1000);
  const paramsToSign = req.body;
  if(paramsToSign.resource_type !=='video' && paramsToSign.resource_type !=='image') return res.status(400).send({success:false,error:'invalid resource type'});

  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder:`uploads/${paramsToSign.resource_type}s/`,
  }, CLOUDINARY_API_SECRET);

  req.cloudinary={timestamp, signature};
    next();
}

