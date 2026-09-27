import { ConflictException, NotFoundException } from "../../common/exception/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { userModel } from "../../DB/model/index.js";


export const signup = async (inputs) => {
  const existEmail=await findOne({model:userModel,filter:{email:inputs.email}})
  if(existEmail)
    throw ConflictException({message:"email already exist go to login"})
  
  inputs.email=inputs.email.toLowerCase()
  const user=await create({model:userModel,data:inputs})
  return user;
};

export const login = async (inputs) => {
  const user=await findOne({model:userModel,filter:{email:inputs.email,password:inputs.password}})
  if(!user)
    throw NotFoundException({message:"email or password not valid"})

  return user;
};
