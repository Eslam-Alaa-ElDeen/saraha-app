import {randomInt}from "node:crypto"

export const otp_key=(email)=>{
    return `User::${email}::ConfirmEmail::OTP`
}
export const otp_key_trails=(email)=>{
    return `User::${email}::trails::OTP`
}

export const otp_key_prefix=(email)=>{
    return `User::${email}`
}

export const createOTP=()=>{
    return randomInt(100000,1000000).toString()
}

