import blog from "../../models/blogModel.js"


export async function deleteBlogController(req,res){
    const {id:blogId} = req.params
    const {id:userId} = req.user

    if (!blogId){
        console.log("blog id not provided")
        res.status(401).json({message:"blog id not provided",success:false})
    }

    try {
        const userBlog = await blog.findOne({_id:blogId})
        if (!userBlog){
            console.log("blog not found")
            res.status(404).json({message:"blog not found",success:false})
        }
        if (userBlog.userId.toString() !== userId){
            console.log(`the request on ${req.originalUrl} is not authorized`)
            res.status(401).json({message:`the request on ${req.originalUrl} is not authorized`,success:false})
        }
        await blog.deleteOne({_id:blogId})
        console.log(`blog deleted successfully`)
        res.status(200).json({message:`blog with title ${userBlog.title} and id ${userBlog._id} deleted successfully`,success:true})

    } 
    catch (error) {
        console.log(error.message)
        res.status(500).json({message:`error deleting blog : ${error.message}`,success:false})
    }

    
}