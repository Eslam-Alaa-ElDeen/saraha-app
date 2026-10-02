import jwt from "jsonwebtoken"
import { findById } from "../../common/repository/index.js"
import { userModel } from "../../DB/model/user.model.js"
import { verifyToken } from "../../common/security/index.js"

export const profile = async(payload) => {

    payload=await verifyToken({payload})
    const id=payload.user.sub


    const user = await findById({
        model:userModel,
        ID:id
    })
    return user;
}