import { createClient } from "redis"
import { REDIS_URI } from "../../config/config.service.js";

export const client = createClient({
    url: REDIS_URI
});

export async function connectRedis(){
    try {
        await client.connect()
        console.log("redis connection stablish successfully");
    } catch (error) {
        console.log("fail to stablish redis connection");
    }
}
