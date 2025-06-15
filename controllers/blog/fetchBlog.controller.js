import blog from "../../models/blogModel.js";

export async function FetchBlogController(req,res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const sortBy = req.query.sortBy || "createdAt"
        const order = req.query.sortOrder || "desc"
        const sortOrder = order === "desc" ? -1 : 1
        const skip = (page - 1) * limit
        const fandom = req.query.state
        const author = req.query.author
        const title = req.query.title
        const tag = req.query.tag

        const filter = {}

        if (typeof title === "string" && title.trim().length > 0) {
            filter.title = { $regex: title.trim(), $options: "i" };
        }

        if (typeof author === "string" && author.trim().length > 0) {
            filter.author = { $regex: author.trim(), $options: "i" };
        }

        if (typeof tag === "string" && tag.trim().length > 0) {
            filter.tags = { $in: [tag.trim()] };
        }

        if (typeof fandom === "string" && fandom.trim().length > 0) {
            filter.fandom = fandom;
        }


    try {
        const fetchedBlog = await blog.find(filter).skip(skip).limit(limit).sort({ [sortBy]: sortOrder });  
        if(fetchedBlog.length<=0){
            console.log("INFO","\n fetchBlog.controller","There are no blogs available,sign in to create a blog")
            return res.status(404).json({message:"There are no blogs available,sign in to create a blog",success:false})
        }
        console.log(`blogs fetched successfully from ${req.originalUrl}`)
        return res.status(200).json({message:"blogs fetched successfully",count:fetchedBlog.length,success:true,data:fetchedBlog})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message,success:false})
    }
    
}