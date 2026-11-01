import { ACCESS_TOKEN_SIGNATURE, REFRESH_TOKEN_SIGNATURE } from "../../config/config.service.js"
import { TOKEN_TYPE } from "../common/enum/token.enum.js"
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../common/exception/index.js"
import { findById } from "../common/repository/index.js"
import { revokeTokenKey, verifyToken } from "../common/security/index.js"
import { getValue, ttl } from "../common/services/cache.service.js"
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

        if(await getValue(revokeTokenKey(payload)))
            throw UnAuthorizedException({message:"you are logged out pls login again"})

        if(user?.changeCredentialTime?.getTime()>(payload.iat*1000))
            throw UnAuthorizedException({message:"you are logged out pls login again"})

        req.user=user;
        req.payload=payload
        next();
    }
}