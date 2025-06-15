import blog from "../../models/blogModel.js"
import getReadingTime from '../../utils/ReadingTimeCalculator.js'



export async function editBlogController(req,res){
    const {id:userId} = req.user
    const {id:blogId} = req.params
    if (!blogId){
        console.log("blog id not provided")
        return res.status(400).json({message:"blog id not provided",success:false})
    }

    if (!req.body){
        console.log("body not provided")
        return res.status(400).json({message:"body not provided, you cannot edit this blog without a body",success:false})
    }


    const {title,description,body,tags,fandom,headImageUrl} = req.body
    try {
        const userBlog = await blog.findById(blogId)

        if (!userBlog){
            console.log("blog not found")
            return res.status(404).json({message:"blog not found, you cannot edit a non-existant blog",success:false})
        }

        if (userBlog.userId.toString() !== userId){
            console.log(`the request on ${req.originalUrl} is not authorized`)
            return res.status(401).json({message:`the request on ${req.originalUrl} is not authorized`,success:false})
        }

        if (!title && !description && !body && !tags && !fandom && !headImageUrl){
            console.log(`blog not edited because no property.provided`)
            return res.status(400).json({message:`blog not edited because no property.provided`,success:false})
        }

        if (title && title.trim().length>0){
            console.log(`title changed from ${userBlog.title} to ${title}  `)
            userBlog.title = title
        }
        
        if (description && description.trim().length>0){
            console.log(`description changed from ${userBlog.description.slice(0,20)} to ${description.slice(0,20)}  `)
            userBlog.description = description
        }
        if (body && body.trim().length>0){
            console.log(`body changed from ${userBlog.body.slice(0,20)} to ${body.slice(0,20)}  `)
            userBlog.body = body
            userBlog.readingTime = getReadingTime(body)
        }

        if (tags && tags.length>0){
            console.log("tags changed")
            userBlog.tags = tags
        }

        if (fandom && fandom.trim().length>0){
            console.log(`fandom changed from ${userBlog.fandom} to ${fandom}`)
            userBlog.fandom = fandom
        }
        if (headImageUrl && headImageUrl.trim().length>0){
            console.log(`ImageUrl changed`)
            userBlog.headImageUrl = headImageUrl
        }
        userBlog.timeStamp.updatedAt = Date.now()

        const savedBlog = await userBlog.save()
        console.log(`blog edited successfully`)
        res.status(200).json({message:"blog edited successfully",data:savedBlog,success:true})

    }
    catch (error) {
        if (error.code === 11000){
            console.log(`blog with title ${title} already exists`)
            return res.status(409).json({message:"blog already exists",success:false})
        }
        console.log(error.message)
        return res.status(500).json({message:`error editing blog : ${error.message}`,success:false})
    
    }
    
    



}