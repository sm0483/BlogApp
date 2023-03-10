// middleware to verify accessToken
// middleware to verify refresh token

// get use data with token
// edit use route



const asyncWrapper = require("../error/asyncWrapper");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const { createJwt, attachCookieToResponse ,tokenValid} = require("../utils/jwt");



const registerUser=asyncWrapper(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name) throw new CustomError("Name should be present",StatusCodes.BAD_REQUEST);
    if(!email) throw new CustomError("Email should be present",StatusCodes.BAD_REQUEST);
    if(!password) throw new CustomError("Password should be present",StatusCodes.BAD_REQUEST);

    const emailCheck=await User.find({email});
    if(emailCheck.length!==0) throw new CustomError("Email already present",StatusCodes.CONFLICT);
    const response=await User.create(req.body);
    res.status(StatusCodes.OK).json({
        name:response.name,
        email:response.email,
        _id:response._id
    });

})


const loginUser=asyncWrapper(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const user = await User.findOne({ email });
    if(!user) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const isValid=await user.comparePassword(password);
    if(!isValid) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const id=user._id.toString();
    const accessToken=createJwt({id},"accessToken");
    attachCookieToResponse(res,{id});
    res.status(StatusCodes.OK).json({accessToken})

})


const getAccessToken=asyncWrapper(async(req,res)=>{
    const {id}=req.body;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const accessToken=createJwt({id},"accessToken");
    res.status(StatusCodes.OK).json({accessToken}); 
})


const getUser=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const response=await User.findById(id);
    if(!response) throw new CustomError("No user found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
        name:response.name,
        email:response.email,
        _id:response._id
    })
})


const logoutUser=asyncWrapper(async(req,res)=>{
    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
        signed: true,
      });

    const accessToken="";
    res.status(StatusCodes.OK).json({accessToken,message:"Logged out"}); 
})




module.exports={
    registerUser,
    loginUser,
    getAccessToken,
    getUser,
    logoutUser
}
