import {randomInt}from "node:crypto"

export const otp_key=(email, action = "ConfirmEmail")=>{
    return `User::${email}::${action}::OTP`
}

export const otp_key_trails=(email, action)=>{
    return action
        ? `User::${email}::${action}::trails::OTP`
        : `User::${email}::trails::OTP`
}

export const otp_key_prefix=(email)=>{
    return `User::${email}`
}
export const otp_key_prefix_action=(email,action)=>{
    return `User::${email}::${action}`
}

export const createOTP=()=>{
    return randomInt(100000,1000000).toString()
}
