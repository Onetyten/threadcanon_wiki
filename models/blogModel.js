import mongoose, { model } from "mongoose";

const blogSchema = new mongoose({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    author:{
        type:String
    },
    state:{
        type:String,
        enum:["draft","published"],
        default:["draft"]
    },
    readCount:{
        type:Number,
        default:0
    },
    readingTime:{
        type:String,
    },
    tags:{
        type:[String],

    },
    timeStamp:{
        createdAt: {type:Date,default:Date.now},
        updatedAt: {type :Date,default:Date.now},
    },
    body:{
        type:String,
        required:true
    },
    rating:{
        type:[{
            userId:{ type:mongoose.Schema.Types.ObjectId,ref:"user"},
            rating:{type:Number, required:true, min:1,max:5}
    }
    ]},
    comments:{
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            content: { type: String, required: true },
        }]
    },
    likedUsers:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"user"
    },
    fandom:{
        type:String,
        required:true
    }

})

const blog = new model("blog",blogSchema)
export default blog