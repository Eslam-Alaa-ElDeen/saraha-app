import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { client } from "../../DB/redis.connection.js";


export const limiter=rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    handler: function (req, res,next) {
        return res.status(429).json({
        message: "Too many requests, please try again later."
        });
    },
    keyGenerator: function (req, res) {
        const ip=ipKeyGenerator(req.ip,52)
        return `${ip}-${req.method}-${req.originalUrl}`;
    },
    legacyHeaders: false,
    standardHeaders:true,
    store:{
        async increment(key) {
        try {
            const current = await client.incr(key);
            if(current === 1) {
                await client.expire(key, 15 * 60);
            }
            return { totalHits: current };
        } catch (error) {
            console.log("Redis Error:"+error);
            return { totalHits: 0 };;
        }
        },
        async decrement(key) {
        try {
            await client.decr(key);
        } catch (error) {
            console.log("Redis Error:"+error);
        }
        },
        async resetKey(key) {
        try {
            await client.del(key);
        } catch (error) {
            console.log("Redis Error:"+error);
        }
        }
    }
})