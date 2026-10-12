import { Router } from 'express'
import {  login, signup, signupWithGmail } from './auth.service.js';
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
router.post("/signup-with-gmail", async (req, res, next) => {
    try {
        const {status,tokens} = await signupWithGmail(req.body,`${req.protocol}://${req.host}`)
        successResponse({
            res,
            status,
            data:tokens,
            message:"user inserted successfully"
        })
    } catch (error) {
        res.json(error.message)
    }

})

router.post("/login", async (req, res, next) => {
    const result = await login(req.body,`${req.protocol}://${req.host}`)

    successResponse({
        res,
        status:201,
        data:result,
        message:"user logged in successfully"
    })
})



export default router