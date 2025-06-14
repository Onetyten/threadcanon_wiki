import user from '../../models/userModel.js'
import blog from '../../models/blogModel.js'
import getReadingTime from '../../utils/ReadingTimeCalculator.js'


export async function CreateBlogController(req,res){
    const userId = req.userId
    if (!userId){
        console.log("WARN","\n createBlog.controller.js","user id not found")
        res.status(401).json({message:'User id not available,Login to get authorized'})
    }
    if (!CheckInputValidity(req)){
        return res.status(400).json({message:"invalid request",success:false})
    }
    const {title,description,body,tags,fandom} = req.body
    const readingTime = getReadingTime(body)

    try {
            const authorProfile = await user.findById(userId)
            const author = authorProfile.firstName +" "+authorProfile.lastName
            const newBlog = await new blog({title,description,body,author,readingTime,userId,tags,fandom})
            await newBlog.save()
            res.status(201).json({})
    }
    catch (error) {
        
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
