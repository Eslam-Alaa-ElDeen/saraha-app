import { Router } from 'express'
import {  login, signup } from './auth.service.js';
import { successResponse } from '../../common/utils/response/success.response.js';
const router = Router(); 

router.post("/signup", async (req, res, next) => {
    const result = await signup(req.body)
    successResponse({
        res,
        status:201,
        data:result,
        message:"user inserted successfully"
    })
})

router.post("/login", async (req, res, next) => {
    const result = await login(req.body)

    successResponse({
        res,
        status:201,
        data:result,
        message:"user loged in successfully"
    })
})



export default router