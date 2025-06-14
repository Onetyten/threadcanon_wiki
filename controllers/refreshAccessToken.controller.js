import express from "express"
import user from "../models/userModel.js"
import jwt from "jsonwebtoken"


export async function refreshTokenController(req,res){
    const refreshToken = req.body.refreshToken
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "Refresh token is required"});
        }

    try {
        const userProfile = await user.findOne({ "refreshTokens.token":refreshToken})
        if (!userProfile){
            console.log("ERROR", "\n source: controller/refreshToken.js", `User not find while verifying refresh token`)
            return res.status(404).json({message:"user not found",success:false})
        }
        const matchedToken  = userProfile.refreshTokens.find( t =>t.token === refreshToken )

        if (!matchedToken){
            console.log("ERROR", "\n source: controller/refreshToken.js", `invalid refresh token from ${userProfile._id}`)
            return res.status(401).json({message:"invalid refresh token",success:false})
        }

        if (new Date(matchedToken.expiresAt) < new Date()){
            console.log("ERROR", "refreshToken.js", `${userProfile.name}s with id ${userProfile._id} refresh token  has expired`)
            userProfile.refreshTokens = userProfile.refreshTokens.filter(t => t.token !== refreshToken)
            await userProfile.save()
            return res.status(401).json({message:"refresh token expired",success:false, error: "TokenExpiredError", code: "TOKEN_EXPIRED"})
        }

        const payload  = {
            user:{
                id:user._id
            }
        }

        const newAccessToken  = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
        console.log(`User ${userProfile.name} with id ${userProfile._id} refreshed access token`);
        res.status(200).json({user: {id: userProfile._id,name: userProfile.name,email: userProfile.email,token:newAccessToken} ,message:"New token assigned",success:true})

    }
    catch (error) {
        res.status(500).json({message:error.message,success:false})
    }



}
