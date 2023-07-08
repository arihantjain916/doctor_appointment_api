const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/CustomError");


exports.isLoggedIn = BigPromise (async (req,res,next)=>{

    const {token} = req.body;

    if(!token){
        return next(new CustomError("Please provide a token",400));
    }

    const isValidToken = await jwt.verify(token,process.env.JWT_SECRET);

    if(isValidToken){

        userId = isValidToken.id;

        const user = await User.findById(userId);
        if(user){
            req.user = user;
            next();
        }
        else{
            return next(new CustomError("User not found with given token."),400);
        }
    }
    else{
        return next(new CustomError("Token is invalid or expired."));
    }
});

exports.customRole = (...roles) =>{

    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return next(new CustomError("You are not allowed to access this resource",403));
        }
        next();
    }
};