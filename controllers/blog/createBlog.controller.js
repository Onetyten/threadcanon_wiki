import user from '../../models/userModel.js'
import blog from '../../models/blogModel.js'
import getReadingTime from '../../utils/ReadingTimeCalculator.js'


export async function CreateBlogController(req,res){
    const { id: userId } = req.user
    if (!userId){
        console.log("ERROR","\n createBlog.controller.js","user id not found")
        res.status(401).json({message:'User id not available,Login to get authorized'})
    }
    if (!CheckInputValidity(req)){
        console.log("WARN","\n createBlog.controller.js","invalid request")
        return res.status(400).json({message:"invalid request",success:false})
    }
    const state = req.query.state || "draft"
    if (state!=="draft" && state!=="published"){
        state = "draft"
    }
    const {title,description,body,tags,fandom,headImageUrl} = req.body
    const readingTime = getReadingTime(body)

    try {
            const authorProfile = await user.findById(userId)
            const author = authorProfile.firstName +" "+authorProfile.lastName
            const newBlog = await new blog({title,description,body,author,readingTime,userId,tags,fandom,headImageUrl,state})
            await newBlog.save()
            console.log(`blog ${newBlog.title} created successfully from ${req.originalUrl}`)
            return res.status(201).json({message:`blog ${newBlog.title} created successfully and saved as ${newBlog.state}`,success:true,data:newBlog})
    }
    catch (error) {
        if (error.code === 11000){
            console.log(`blog with title ${title} already exists`)
            return res.status(409).json({message:"blog already exists",success:false})
        }
       console.log(error)
       return res.status(500).json({message:error.message,success:false})
    }
}

function CheckInputValidity(req){
    const {title,body} = req.body
    if (!title || title.length<=0){
        console.log(`invalid title from ${req.originalUrl}`)
        return false
    }

    if (!body || body.length<=0){
        console.log(`invalid body from ${req.originalUrl}`)
        return false
    }
    return true
}
