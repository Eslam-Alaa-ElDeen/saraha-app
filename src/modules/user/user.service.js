import jwt from "jsonwebtoken"
import { findById } from "../../common/repository/index.js"
import { userModel } from "../../DB/model/user.model.js"
import { createLoginCredentials, createRevokeToken, Decrypt, userBaseRevokeTokenKey, verifyToken } from "../../common/security/index.js"
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SIGNATURE } from "../../../config/config.service.js"
import { ConflictException } from "../../common/exception/error.exception.js"
import { LogoutTypeEnum } from "../../common/enum/logoutType.enum.js"
import { deleteKey, keys } from "../../common/services/cache.service.js"

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
        }(),
        image: user.image ?? null
    };
}

export const rotate=async(payload,user,issuer)=>{

    const accessExpiresIn=(payload.iat+parseInt(ACCESS_TOKEN_EXPIRES_IN))*1000
    const currentTime=Date.now()+(5*6000);

    if(currentTime< accessExpiresIn)
        throw ConflictException({message:"sorry we cannot create new login credentials while current access token still within valid time range"})

    const data= await createLoginCredentials({user,issuer})
    await createRevokeToken(payload)
    return data;
}


export const logout=async(user,payload,{actions=LogoutTypeEnum.ONE})=>{
    switch (actions) {
        case LogoutTypeEnum.ALL:
            user.changeCredentialTime=Date.now()
            user.save()
            await deleteKey(await keys(userBaseRevokeTokenKey(payload)))
            return {message:"users logged out successfully"}
        default:
            return await createRevokeToken(payload)
            break;
    }
}

export const uploadProfilePhoto=async(file,user)=>{
    user.image=file.finalPath
    await user.save()

    return user.image;
}
