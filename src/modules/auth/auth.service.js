import { OAuth2Client } from "google-auth-library";
import { REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SIGNATURE, SALT, WEB_CLIENT_ID } from "../../../config/config.service.js";
import { BadRequestException, ConflictException, NotFoundException, TooManyRequestException } from "../../common/exception/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { Compare, createToken, Hash,Decrypt, Encrypt, createLoginCredentials, userBaseRevokeTokenKey } from "../../common/security/index.js";
import { userModel } from "../../DB/model/index.js";
import { ProviderEnum } from "../../common/enum/provider.enum.js";
import {randomUUID}from "node:crypto"
import { createOTP, otp_key, otp_key_prefix, otp_key_prefix_action, otp_key_trails } from "../../common/utils/email/otp.js";
import { eventEmitterEmail } from "../../common/events/event.email.js";
import { sendEmail } from "../../common/utils/email/sendEmail.js";
import { emailTemplate } from "../../common/utils/email/email.template.js";
import { deleteKey, expire, getValue, incr, keys, setValue, ttl } from "../../common/services/cache.service.js";

const client=new OAuth2Client();

const sendEmailOTP=async(email, action)=>{

  const ttlExist=await ttl(otp_key(email, action))
  if(ttlExist>0)
    throw ConflictException({message:`the old OTP is active to use ,you can resend a new OTP after ${ttlExist}`})

  const trails=await getValue(otp_key_trails(email, action))
  if(trails>=3)
    throw TooManyRequestException({message:"You have made too many requests ,you blocked for 5 min"})

  const otp=createOTP()
  await setValue({
    key:otp_key(email, action),
    value:await Hash(otp,SALT),
    ttl:300
  })

  const currTrails=await incr(otp_key_trails(email, action))
  if (currTrails === 1) {
      await expire({
          key: otp_key_trails(email, action),
          ttl: 300
      });
  }

  if (currTrails === 3) {
      await expire({
          key: otp_key_trails(email, action),
          ttl: 300
      });
  }

  eventEmitterEmail.emit("confirm_email", { email, otp });
  return
}

async function verifyGoogleAccount(idToken){
  const ticket =await client.verifyIdToken({
    idToken,
    audience:WEB_CLIENT_ID
  })

  const payload=ticket.getPayload();
  if(!payload.email_verified)
    throw BadRequestException({message:"email not verified"})

  return payload
}


export const signupWithGmail = async ({idToken},issuer) => {
  const {name,email,picture}=await verifyGoogleAccount(idToken)

  const existAccount=await findOne({
    model:userModel,
    filter:{email}
  })

  if(existAccount){
    if(existAccount.provider!=ProviderEnum.GOOGLE)
      throw ConflictException({message:"Invalid account"})

    return{status:200,tokens: await createLoginCredentials({user:existAccount,issuer})};
  }

  const user=await create({
    model:userModel,
    data:{
      userName:name,
      email,
      confirmEmail:new Date(),
      provider:ProviderEnum.GOOGLE,
      image:picture
    }
  })

    return{status:201,tokens: await createLoginCredentials({user,issuer})};
};

export const signup = async (inputs) => {
  const existEmail=await findOne({model:userModel,filter:{email:inputs.email}})
  if(existEmail)
    throw ConflictException({message:"email already exist go to login"})

  await sendEmailOTP(inputs.email, "ConfirmEmail")

  inputs.email=inputs.email.toLowerCase()
  const {userName,email,password,phone,gender,DOB}=inputs;
  const user=await create({
    model:userModel,
    data:{
    userName,
    email,
    password:await Hash(password,SALT)
    ,phone:await Encrypt(phone)
    ,gender,DOB}

  })
  return user;
};


export const login = async (inputs,issuer) => {
  const user=await findOne({model:userModel,filter:{email:inputs.email}})
  if(!user)
    throw NotFoundException({message:"email or password not valid"})

  const matchPass=await Compare(inputs.password,user.password);

  if(!matchPass)
    throw NotFoundException({message:"email or password not valid"})

  if(user.isTwoFactorEnabled==1){
    await sendEmailOTP(user.email,"TwoFactorAuthentication_login");
    return {message:`otp send to ${inputs.email} write it to confirm and pass 2FA`}
  }
  user.phone=await Decrypt(user.phone)
  const jwtid=randomUUID();
  const access_token=await createToken({
      payload:{
        user:{
          sub:user._id
        }
      },
      options:{
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
        noTimestamp:false,
        expiresIn:REFRESH_TOKEN_EXPIRES_IN,
        issuer,
        jwtid
      }
  })
  return {access_token,refresh_token};
};

export const confirmEmail=async({email,otp})=>{
  const user=await findOne({
    model:userModel,
    filter:{
      email,provider:ProviderEnum.SYSTEM,confirmEmail:{$exists:false}
    }
  })

  if(!user)
    throw BadRequestException({message:"the user not exists or already confirmed"})

  const cipherOTP=await getValue(otp_key(email, "ConfirmEmail"))

  if(cipherOTP==null || !await Compare(otp,cipherOTP))
    throw BadRequestException({message:"OTP is wrong or expired"})

  await deleteKey(await keys(`${otp_key_prefix(email)}`));

  user.confirmEmail=Date.now();
  await user.save();
  return
}

export const resendOTP=async({email})=>{
  const user=await findOne({
    model:userModel,
    filter:{
      email,provider:ProviderEnum.SYSTEM,confirmEmail:{$exists:false}
    }
  })

  if(!user)
    throw BadRequestException({message:"the user not exists or already confirmed"})

  await sendEmailOTP(email, "ConfirmEmail")
}

export const forgetPasswordSendOTP=async({email})=>{
  const user=await findOne({
    model:userModel,
    filter:{
      email,provider:ProviderEnum.SYSTEM,confirmEmail:{$exists:true}
    }
  })

  if(!user)
    throw BadRequestException({message:"the user not exists"})

  await sendEmailOTP(email, "ForgotPassword")
}

export const updatePasswordVerifyOTP=async({email,otp,newPassword})=>{
  const user=await findOne({
    model:userModel,
    filter:{
      email,provider:ProviderEnum.SYSTEM,confirmEmail:{$exists:true}
    }
  })

  if(!user)
    throw BadRequestException({message:"User not exists"})

  const cipherOTP=await getValue(otp_key(email, "ForgotPassword"))

  if(cipherOTP==null || !await Compare(otp,cipherOTP))
    throw BadRequestException({message:"OTP is wrong or expired"})

  user.password=await Hash(newPassword,SALT)
  user.changeCredentialTime=Date.now()
  await user.save()

  const payload={
    user:{
      sub:user._id
    }
  }
  //delete the keys from redis(revoke token and send otp)
  const foundKeys=await Promise.all([
      keys(userBaseRevokeTokenKey(payload)),
      keys(`${otp_key_prefix(email)}`)
  ])

  await deleteKey([...foundKeys[0],...foundKeys[1]])
  return;
}

export const sendOtpTwoFactor=async(user,{status})=>{
  if(  user.isTwoFactorEnabled==status)
    throw BadRequestException({message:(status==1?"two factor authentication already active":"two factor authentication already not active")})

  await sendEmailOTP(user.email,"TwoFactorAuthentication");
}

export const confirmOtpTwoFactor=async(user,{status,otp})=>{

  const cipherOTP=await getValue(otp_key(user.email, "TwoFactorAuthentication"))

  if(cipherOTP==null || !await Compare(otp,cipherOTP))
    throw BadRequestException({message:"OTP is wrong or expired"})

  await deleteKey(await keys(`${otp_key_prefix_action(user.email,"TwoFactorAuthentication")}`));

  user.isTwoFactorEnabled=status
  await user.save();
}


export const loginConfirmEmailTwoFactorAuthentication=async({otp,email},issuer)=>{
  const user=await findOne({
    model:userModel,
    filter:{
      email
    }
  })

  if(!user)
    throw BadRequestException({message:"the user not exists or already confirmed"})

  const cipherOTP=await getValue(otp_key(user.email, "TwoFactorAuthentication_login"))

  if(cipherOTP==null || !await Compare(otp,cipherOTP))
    throw BadRequestException({message:"OTP is wrong or expired"})

  await deleteKey(await keys(`${otp_key_prefix_action(user.email,"TwoFactorAuthentication_login")}`));
  return await createLoginCredentials({user,issuer})
}





