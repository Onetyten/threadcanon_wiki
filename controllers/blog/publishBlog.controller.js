import blog from "../../models/blogModel.js"



export async function PublishBlogController(req,res){
    const {id:userId} = req.user
    const blogId = req.params.blogId

    if (!userId){
        console.log("ERROR","\n createBlog.controller.js","user id not found")
        res.status(401).json({message:'User id not available,Login to get authorized',success:false})
    }

    if (!blogId){
        console.log("ERROR","\n createBlog.controller.js","blog id not provided")
        res.status(400).json({message:"blog id not provided",success:false})
    }
    try {
        const userBlog = await blog.findById(blogId)
        if (!userBlog){
            console.log("ERROR","\n createBlog.controller.js","blog not found")
            res.status(404).json({message:"blog not found",success:false})
        }
        if (userBlog.userId.toString() !== userId.toString()){
            console.log("This user is not authorized to publish this blog")
            res.status(401).json({message:"This user is not authorized to publish this blog",success:false})
        } 
        userBlog.state = "published"
        await userBlog.save()
        console.log(`blog ${userBlog.title} published successfully`)
        res.status(200).json({message:`blog ${userBlog.title} published successfully`,success:true,data:userBlog})
    }

    catch (error) {
        console.log(error)
        res.status(500).json({message:error.message,success:false})     
    }
    

}