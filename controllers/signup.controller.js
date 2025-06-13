import user from "../models/userModel.js";
import bcrypt from 'bcrypt'




export async function signupController (req,res){

    if (!HandleRequestValidity(req)){
        return res.status(400).json({message:"invalid request",success:false})
    }

    const {email,firstName,lastName,password,profileImageUrl} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword  = await bcrypt.hash(password,salt)

    try {
            const profile = await new user({email,firstName,lastName,profileImageUrl,password:hashedPassword})
            const savedUser = await profile.save()
            console.log(`user ${savedUser.firstName} with id ${savedUser._id} profile created successfully`)
            res.status(201).json({message:"user created successfully",data:savedUser,success:true})
    } 

    catch (error) {
        res.status(500).json({message:"internal server error",success:false})
        console.log(error)
    }

}

function HandleRequestValidity(req){
    const {email,firstName,lastName,password,profileImageUrl} = req.body
    if (!email || email.length<=0){
        console.log(`invalid email from ${req.originalUrl}`)
        return false
    }
    if(!firstName || firstName.length<=0){
        console.log(`invalid first name from ${req.originalUrl}`)
        return false
    }
    if (!lastName || lastName.length<=0){
        console.log(`invalid last name from ${req.originalUrl}`)
        return false
    }
    if (!password || password.length<=0){
        console.log(`invalid password from ${req.originalUrl}`)
        return false
    }
    return true
    
}
