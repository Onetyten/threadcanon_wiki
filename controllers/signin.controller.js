import user from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'




export async function signInController(req,res) {
    const {email,password} = req.body
    if (!HandleRequestValidity(req)){
        return res.status(400).json({message:"invalid request",success:false})
    }

    try{
        const userProfile = await user.findOne({email})
        if (!userProfile){
            console.log(`userProfile not found from ${req.originalUrl}`)
            return res.status(404).json({message:"userProfile not found",success:false})
        }
        const isPasswordValid = await bcrypt.compare(password,userProfile.password)
        if (!isPasswordValid){
            console.log(`invalid password from userProfile ${userProfile.email} from ${req.originalUrl}`)
            return res.status(401).json({message:"invalid password",success:false})
        }
        const refreshToken = crypto.randomBytes(40).toString('hex')
        const expiresAt = new Date(Date.now() + 6 * 4 * 7 * 24 * 60 * 60 * 1000)
        userProfile.refreshTokens.push({token:refreshToken,expiresAt:expiresAt})
        userProfile.lastLogin = Date.now()
        const payload ={
            user:{
                id:userProfile._id
            }
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
        const savedUser = await userProfile.save()
        console.log(`login successful from ${req.originalUrl}`)
        return res.status(200).json({message:"login successful",success:true,token:token,refreshToken:userProfile.refreshTokens[userProfile.refreshTokens.length-1],data:{id:userProfile._id,name:userProfile.name,email:userProfile.email,lastLogin:userProfile.lastLogin}})
    }

    catch(error){
        res.status(500).json({message:error.message,success:false})
    }
}


function HandleRequestValidity(req){
    const {email,password} = req.body

    if (!email || email.length<=0){
        console.log(`invalid email from ${req.originalUrl}`)
        return false
    }
    if (!password || password.length<=0){
        console.log(`invalid password from ${req.originalUrl}`)
        return false
    }
    return true
    
}
