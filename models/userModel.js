import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        profileImageUrl:{
            type:String,
        },
        refreshTokens: [{
            token: { type: String, required: true }, 
            expiresAt: { type: Date, required: true },
            createdAt: { type: Date, default: Date.now },
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },




    }
)

const user = new mongoose.model("user",userSchema)
export default user