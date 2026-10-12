import { OAuth2Client } from "google-auth-library";
import { REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SIGNATURE, SALT, WEB_CLIENT_ID } from "../../../config/config.service.js";
import { BadRequestException, ConflictException, NotFoundException } from "../../common/exception/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { Compare, createToken, Hash,Decrypt, Encrypt, createLoginCredentials } from "../../common/security/index.js";
import { userModel } from "../../DB/model/index.js";
import jwt from "jsonwebtoken"
import { ProviderEnum } from "../../common/enum/provider.enum.js";

const client=new OAuth2Client();

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
  
    user.phone=await Decrypt(user.phone)

      const access_token=await createToken({
          payload:{
            user:{
              sub:user._id
            }
          },
          options:{
            noTimestamp:false,
            expiresIn:60*60,
            issuer
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
            issuer
          }
      })
  return {access_token,refresh_token};
};



