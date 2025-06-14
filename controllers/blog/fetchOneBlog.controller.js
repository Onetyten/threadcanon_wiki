import blog from "../../models/blogModel.js";
import user from "../../models/userModel.js";



export async function FetchOneBlogController(req,res) {
    try {
            const filter = { _id:req.params.id, state:"published"}
            const fetchedBlog = await blog.findOne(filter)
            if (!fetchedBlog || fetchedBlog.length<=0){
                console.log("INFO","\n fetchBlog.controller","Blog ")
                return res.status(404).json({message:`No blog found with id ${req.params.id}`,success:false})
            }
            const authorProfile = await user.findById(fetchedBlog.userId)
            fetchedBlog.readCount++
            await fetchedBlog.save()
            console.log(`blog fetched successfully from ${req.originalUrl}`)
            return res.status(200).json({message:"blog fetched successfully",success:true , data:fetchedBlog , authorProfile:{email:authorProfile.email,firstName:authorProfile.firstName, lastName:authorProfile.lastName, profileImageUrl:authorProfile.profileImageUrl}})
    
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({message :`error fetching blogs : ${error.message}`,success:false})
        }
    
}