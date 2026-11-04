import { BadRequestException, NotFoundException } from "../../common/exception/error.exception.js";
import { create, find, findById, findByIdAndDelete } from "../../common/repository/base.repository.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/user.model.js";


export const sendMessage=async({content,receiverId}={}, paths)=>{
    const checkReceiver=await findById({
        model:userModel,
        ID:receiverId
    })
    if(!checkReceiver)
        throw NotFoundException({message:"receiver not found"})

    if (!content && paths.length == 0) {
        throw BadRequestException({message:"You must send either message content or at least one attachment"});
    }
    const message=await create({
        model:messageModel,
        data:{
            content,
            receiverId,
            attachments:paths
        }
    })
    return message;
}
export const sendMessageByAccount=async({content,receiverId}={}, paths,user)=>{
    const checkReceiver=await findById({
        model:userModel,
        ID:receiverId
    })
    if(!checkReceiver)
        throw NotFoundException({message:"receiver not found"})

    if (!content && paths.length == 0) {
        throw BadRequestException({message:"You must send either message content or at least one attachment"});
    }
    const message=await create({
        model:messageModel,
        data:{
            content,
            receiverId,
            attachments:paths,
            senderId:user._id
        }
    })
    return message;
}

export const getMessages=async({type,page,limit,search,populate,sort={createdAt:-1}}={},user=undefined)=>{
    let filter={};

    if(type=="1"){
        filter={senderId:user._id}
    }else if(type=="0"){
        filter={receiverId:user._id}
    }else{
        filter={$or:[
            {senderId:user._id},
            {receiverId:user._id}
        ]}
    }
    const { dataInfo, ...messages } = await find({
        model:messageModel,
        filter,
        options:{
            page,
            limit,
            search,
            sort,
            populate
        }
    })
    return { dataInfo, ...messages };
}

export const deleteMessage=async({messageId}={},user)=>{
    const message=await findByIdAndDelete({
        model:messageModel,
        ID:messageId
    })
    if(!message)
        throw NotFoundException({message:"message not found"})
    
    return {message:"message deleted successfully"}
}

export const getMessage=async({messageId}={},user)=>{
    const message=await findById({
        model:messageModel,
        ID:messageId
    })
    if(!message)
        throw NotFoundException({message:"message not found"})
    
    return message;
}