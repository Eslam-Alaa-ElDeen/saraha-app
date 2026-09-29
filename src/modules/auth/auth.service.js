import { SALT } from "../../../config/config.service.js";
import { ConflictException, NotFoundException } from "../../common/exception/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { Decrypt, Encrypt } from "../../common/security/encryption.security.js";
import { Compare, Hash } from "../../common/security/index.js";
import { userModel } from "../../DB/model/index.js";


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

export const login = async (inputs) => {
  const user=await findOne({model:userModel,filter:{email:inputs.email}})
  if(!user)
    throw NotFoundException({message:"email or password not valid"})

  const matchPass=await Compare(inputs.password,user.password);

  if(!matchPass)
    throw NotFoundException({message:"email or password not valid"})
  
  user.phone=await Decrypt(user.phone)
  return user;
};
