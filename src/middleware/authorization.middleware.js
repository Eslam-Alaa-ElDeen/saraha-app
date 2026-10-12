import { ForbiddenException } from "../common/exception/error.exception.js"



export const authorization=(accessRole=[])=>{
    return async (req,res,next)=>{
        if(req.user.role<accessRole){
            throw ForbiddenException({message:"forbidden account"})
        }

        next();
    }
}