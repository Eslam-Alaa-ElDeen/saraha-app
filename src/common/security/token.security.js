import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRES_IN } from "../../../config/config.service.js"

export const createToken=async({payload={},options={},secret=ACCESS_TOKEN_EXPIRES_IN}={})=>{
    return await jwt.sign(payload,secret,options)
}

export const verifyToken=async({payload={},secret=ACCESS_TOKEN_EXPIRES_IN}={})=>{
    return await jwt.verify(payload,secret)
}
export const decodeToken=async({payload={}}={})=>{
    return await jwt.decode(payload)
}