import jwt from "jsonwebtoken"
import dbauth from "../models/authentication.js"
export const tokenauth=async(req,res)=>{
    try{
    let {token}=req.body;
    if(!token){
        return res.status(404).json({msg:"user not authorised"});
    }
    let data=jwt.verify(token,process.env.JWT_SECRET);
    let userdata=await dbauth.findOne({username:data.username,_id:data.userId})
    if(!userdata){
        return res.status(404).json({msg:"user data not found"});
    }
    return res.status(200).json({msg:"sucess"});
}catch(err){
  return res.status(404).json({msg:"error occured"});
}
}