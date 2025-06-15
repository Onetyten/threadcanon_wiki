import blog from "../../models/blogModel.js";

export async function FetchPostsController(req,res) {
    const {id:userId} = req.user
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const sortBy = req.query.sortBy || "createdAt"
    const order = req.query.sortOrder || "desc"
    const sortOrder = order === "desc" ? -1 : 1
    const skip = (page - 1) * limit
    const state = req.query.state || "published"
    let filter = {userId}

    const allowedStates = ['published', 'draft'];
    if (req.query.state && !allowedStates.includes(req.query.state)) {
    return res.status(400).json({
        success: false,
        message: 'Invalid state parameter',
    });
    }
    
    if (req.query.state) {
    filter.state = req.query.state;
    }


    try {
        const fetchedBlog = await blog.find(filter).skip(skip).limit(limit).sort({[sortBy]:sortOrder})
        if (!fetchedBlog){
            console.log("INFO","\n fetchBlog.controller","Blog ")
            return res.status(404).json({message:"No blogs found",success:false})
        }
        if(fetchedBlog.length<=0){
            console.log("INFO","\n fetchBlog.controller","There are no blogs left, you,ve hit the blog limit ")
            return res.status(404).json({message:"here are no blogs left, you,ve hit the blog limit",success:false})
        }
        console.log(`blogs fetched successfully from ${req.originalUrl}`)
        return res.status(200).json({message:"blogs fetched successfully",count:fetchedBlog.length,success:true,data:fetchedBlog})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`error fetching blogs : ${error.message}`,success:false})
    }
    
}