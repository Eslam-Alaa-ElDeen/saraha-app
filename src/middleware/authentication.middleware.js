import { ACCESS_TOKEN_SIGNATURE, REFRESH_TOKEN_SIGNATURE } from "../../config/config.service.js"
import { TOKEN_TYPE } from "../common/enum/token.enum.js"
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../common/exception/index.js"
import { findById } from "../common/repository/index.js"
import { verifyToken } from "../common/security/index.js"
import { userModel } from "../DB/model/index.js"

const type=(tokenType)=>{
    if(tokenType==TOKEN_TYPE.access)
        return ACCESS_TOKEN_SIGNATURE
    else
        return REFRESH_TOKEN_SIGNATURE
}

export const authentication=(tokenType=TOKEN_TYPE.access)=>{
    return async(req,res,next)=>{
        const signature=type(tokenType)
        const {authorization}=req.headers

        const [key,credential]=authorization.split(" ");

        console.log({key,credential});
        
        if(!credential)
            throw UnAuthorizedException({message:"UnAuthorized account"})
        
        const payload=await verifyToken({payload:credential,secret:signature})
        
        if (!payload?.user?.sub) {
            throw BadRequestException({message:"missing token payload"})
        }
        const user=await findById({
            model:userModel,
            ID:payload.user.sub
        })

        if(!user)
            throw NotFoundException({message:"invalid account"})

        req.user=user;
        req.payload=payload
        next();

    }
}