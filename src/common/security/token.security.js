import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SIGNATURE } from "../../../config/config.service.js"
import { randomUUID } from "node:crypto"
import { setValue } from "../services/cache.service.js"

export const createToken=async({payload={},options={},secret=ACCESS_TOKEN_SIGNATURE}={})=>{
    return await jwt.sign(payload,secret,options)
}

export const verifyToken=async({payload={},secret=ACCESS_TOKEN_SIGNATURE}={})=>{
    return await jwt.verify(payload,secret)
}
export const decodeToken=async({payload={}}={})=>{
    return await jwt.decode(payload)
}

export const createLoginCredentials=async({user={},issuer="",options={}})=>{
        const jwtid=randomUUID();
        
        const access_token=await createToken({
            payload:{
                user:{
                    sub:user._id
                }
            },
            options:{
                ...options,
                noTimestamp:false,
                expiresIn:60*60,
                issuer,
                jwtid
            }
        })
    
        const refresh_token=await createToken({
            payload:{
                user:{
                sub:user._id
                }
            },
            secret:REFRESH_TOKEN_SIGNATURE,
            options:{
                ...options,
                noTimestamp:false,
                expiresIn:REFRESH_TOKEN_EXPIRES_IN,
                issuer,
                jwtid
            }
        })
    return {access_token,refresh_token};
}
export const revokeTokenKey=(payload)=>{
    return `User::${payload.user.sub}::Revoke_Token::${payload.jti}`
}
export const userBaseRevokeTokenKey=(payload)=>{
    return `User::${payload.user.sub}::Revoke_Token`
}
export const createRevokeToken=async(payload)=>{
    const refreshExpires=(payload.iat+REFRESH_TOKEN_EXPIRES_IN);
    const ttl=(refreshExpires-Math.ceil(Date.now()/1000))
    await setValue({
        key:revokeTokenKey(payload),
        value:payload.jti,
        ttl
    })
}