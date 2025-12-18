import { error } from "console";
import fs from "fs";
import mime from 'mime';
import path from "path";
export const getImage = (req, res) => {
  const { src } = req.query;
  try {
    const readStream = fs.createReadStream(`./${src}`, {
      highWaterMark: 16384,
    });
    readStream.pipe(res);
    readStream.on("end", () => {
      return res.end();
    });
    readStream.on("error", (error) => {
      console.log(error);
      res.status(400).send({ success: false, error });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};

export const getVideo = (req, res) => {
  const { src } = req.query;
  const {range}=req.headers;
  try{

    
    if (!range) return res.status(404).send({success:false,error:'range is required'}) 
    const filesize=fs.statSync(`./${src}`).size;
    const chunkSize=10**6;
    const start=Number(range.replace(/\D/g,''));
    const end=Math.min(start+chunkSize,filesize-1);//filesize-1 because readstream start reads from 0 byte to toatl by -1 i.e it reads first byte as 0
    //
    

const baseDir = path.resolve("./uploads");
// src is like "uploads/filename.mp4"
let decoded = decodeURIComponent(src);

// Remove the leading "uploads/" so it doesn't duplicate
decoded = decoded.replace(/^uploads[\\/]/, "");

// Create absolute path
const filePath = path.resolve(baseDir, decoded);

//prevnts somenone trying to view into otrher directries. like setting src=../.env or etc
console.log(filePath);
if (!filePath.startsWith(baseDir)) {
  return res.status(400).json({ success: false, error: "Invalid path" });
}
    //
    const readStream=fs.createReadStream(filePath,{start,end})
    readStream.on('error',()=>{
      console.log(error)
    })
    readStream.on('end',()=>{
      return res.end();
    });
    const contentLength=end-start+1;
    const contentType=mime.getType(`./${src}`);
    
    const headers={
      'Content-Range':`bytes ${start}-${end}/${filesize}`,
      'Accept-Ranges':'bytes',
      'content-Length':contentLength,
      'content-type':contentType
    }
    res.writeHead(206,headers);
    readStream.pipe(res);

  }
  catch(error){
    console.log(error);
    res.status(404).send({success:false,error})
  }
};
