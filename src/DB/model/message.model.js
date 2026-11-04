import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    content:{
        type:String,
        required:function(){
            return !this.attachments?.length
        },
        minLength:1,
        maxLength:10000
    },
    senderId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    attachments:[String]
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    autoIndex:true
})

export const messageModel=mongoose.models.Message|| mongoose.model("Message",messageSchema)