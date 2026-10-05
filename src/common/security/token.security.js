import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SIGNATURE } from "../../../config/config.service.js"

export const createToken=async({payload={},options={},secret=ACCESS_TOKEN_SIGNATURE}={})=>{
    return await jwt.sign(payload,secret,options)
}

export const verifyToken=async({payload={},secret=ACCESS_TOKEN_SIGNATURE}={})=>{
    return await jwt.verify(payload,secret)
}
export const decodeToken=async({payload={}}={})=>{
    return await jwt.decode(payload)
}

export const createLoginCredentials=async({payload={},issuer="",options={}})=>{
        const access_token=await createToken({
            payload:{
                user:{
                    sub:payload.user.sub
                }
            },
            options:{
                ...options,
                noTimestamp:false,
                expiresIn:60*60,
                issuer
            }
        })
    
        const refresh_token=await createToken({
            payload:{
                user:{
                sub:payload.user.sub
                }
            },
            secret:REFRESH_TOKEN_SIGNATURE,
            options:{
                ...options,
                noTimestamp:false,
                expiresIn:REFRESH_TOKEN_EXPIRES_IN,
                issuer
            }
        })
    return {access_token,refresh_token};
}