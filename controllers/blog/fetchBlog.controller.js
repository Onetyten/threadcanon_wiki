import blog from "../../models/blogModel.js";

export async function FetchBlogController(req,res) {

    try {
        const fetchedBlog = await blog.find({state:"published"})
        if (!fetchedBlog){
            console.log("INFO","\n fetchBlog.controller","Blog ")
            return res.status(404).json({message:"No blogs found",success:false})
        }
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