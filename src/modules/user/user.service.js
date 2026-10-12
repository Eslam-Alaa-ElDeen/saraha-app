import jwt from "jsonwebtoken"
import { findById } from "../../common/repository/index.js"
import { userModel } from "../../DB/model/user.model.js"
import { createLoginCredentials, Decrypt, verifyToken } from "../../common/security/index.js"
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SIGNATURE } from "../../../config/config.service.js"
import { ConflictException } from "../../common/exception/error.exception.js"

export const profile = async(user) => {
    return {
        name:user.userName,
        email:user.email,
        gender:function(g=user.gender){
            if (g==0) {
                return 'male'
            }else{
                return 'female'
            }
        }()
    };
}

export const rotate=async(payload,user,issuer)=>{

    const accessExpiresIn=(payload.iat+parseInt(ACCESS_TOKEN_EXPIRES_IN))*1000
    const currentTime=Date.now()+(5*6000);

    if(currentTime< accessExpiresIn)
        throw ConflictException({message:"sorry we cannot create new login credentials while current access token still within valid time range"})
    return await createLoginCredentials({user,issuer})
}