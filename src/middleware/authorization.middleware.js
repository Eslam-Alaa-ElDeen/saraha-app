import { ForbiddenException } from "../common/exception/error.exception.js"



export const authorization=(accessRole=[])=>{
    return async (req,res,next)=>{
        if(!accessRole.includes(req.user.role)){
            throw ForbiddenException({message:"forbidden account"})
        }

        next();
    }
}