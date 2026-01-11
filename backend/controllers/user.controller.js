import {asynchnadler} from "../utils/asynchandler.js";
import {apierror} from "../utils/apierror.js";
import {apiresponse} from "../utils/apiresponse.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";


const genrateaccessandrefreshtoken = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (!user) {
            throw new apierror(404, "User not found");
        }
        const accesstoken = user.genarateaccesstoken();
        const refreshtoken = user.genaraterefreshtoken();
        user.refreshtoken = refreshtoken;
        await user.save({ validateBeforeSave: false });
        return { accesstoken, refreshtoken };
    } catch (err) {
        throw new apierror(500, "Token generation failed");
    }
}



const registeruser=asynchnadler(async(req,res)=>{
    const {username,email,password}=req.body;
    if([username,email,password].some((field)=> field?.trim()==="")){
        throw new apierror(400,"All fields are required");
    }
    const existeduser=await User.findOne({$or:[{email},{username}]});
    if(existeduser){
        throw new apierror(409,"User with given email or username already exists");
    }
    const user=await User.create({username,email,password});
    const createduser=await User.findById(user._id).select("-password -refreshtoken");
    if(!createduser){
        throw new apierror(500,"Unable to create user");
    }
    // Generate tokens and set cookies just like login
    const {accesstoken, refreshtoken} = await genrateaccessandrefreshtoken(user._id);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    };
    return res
        .status(201)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(new apiresponse(201, { user: createduser, accesstoken }, "User registered and logged in successfully"));
});




const loginuser=asynchnadler(async(req,res)=>{
   const {email,password}=req.body;
   if(!email){
        throw new apierror(400,"Email is required");

   }
   const user=await User.findOne({email});
   if(!user){
      throw new apierror(404,"User not found");
   }    

    const ispasswordcorrect=await user.isPasswordcorrect(password);
    if(!ispasswordcorrect){
      throw new apierror(401,"Invalid credentials");
    }
    const{accesstoken,refreshtoken}=await genrateaccessandrefreshtoken(user._id);


    const loggedinuser=await User.findById(user._id).select("-password -refreshtoken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'lax', // Recommended for most apps
    };
      
    return res.status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(new apiresponse(200, { user: loggedinuser, accesstoken }, "User logged in successfully"));
});   


const logoutuser=asynchnadler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshtoken:undefined}
        },
        {new:true}
    );

    const options={
        httpOnly:true,
        secure:true
    };

    return res
        .status(200)
        .clearCookie("accesstoken",options)
        .clearCookie("refreshtoken",options)
        .json(new apiresponse(200,null,"User logged out successfully"));
});


const refreshtoken=asynchnadler(async(req,res)=>{
    const incomingrefreshtoken=
    req.cookies?.refreshtoken ||
    req.body.refreshtoken;
    if(!incomingrefreshtoken){
        throw new apierror(401,"unauthorized access,token missing  ");
    }
    const decodedtoken=jwt.verify(
        incomingrefreshtoken,
        process.env.REFRESH_TOKEN_SECRET
    );
    const user=await User.findById(decodedtoken?._id);
    if(!user){
        throw new apierror(404,"invalid refresh token,user not found");
    }
    if(incomingrefreshtoken!==user.refreshtoken){
        throw new apierror(401,"unauthorized access,invalid refresh token,expired access token");
    }
    const options={
        httpOnly:true,
        secure:true,
    };
    const{accesstoken,refreshtoken}=await genrateaccessandrefreshtoken(user._id);
    return res
    .status(200).cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(new apiresponse(200,{accesstoken,refreshtoken},"Access token refreshed successfully"));
});
// Delete current user
const deleteCurrentUser = asynchnadler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new apierror(401, "Unauthorized: No user found");
    }
    await User.findByIdAndDelete(userId);
    // Optionally clear cookies
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
    return res.status(200).json(new apiresponse(200, null, "User account deleted successfully"));
});

export {registeruser,loginuser,logoutuser,refreshtoken, deleteCurrentUser};