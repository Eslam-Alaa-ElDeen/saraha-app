import { client } from "../../DB/redis.connection.js";


export const setValue = async ({ key, value, ttl }) => {
    try {
        const mainValue = (typeof value === "object" && value !== null)
            ? JSON.stringify(value)
            : value;

        const options = ttl ? { EX: ttl } : {};
        return await client.set(key, mainValue, options);
    } catch (error) {
        console.error(error, "\n redis setValue Error");
        throw error;
    }
}

export const updateValue = async ({ key, value, ttl }) => {
    try {
        const mainValue = (typeof value === "object" && value !== null)
            ? JSON.stringify(value)
            : value;
        // XX (Set if exists): updates the key only if it already exists in redis
        const options = { XX: true };
        if (ttl) options.EX = ttl;

        const result = await client.set(key, mainValue, options);
        return result === 'OK' ? 1 : 0;
    } catch (error) {
        console.error(error, "\n redis updateValue Error");
        throw error;
    }
}

export const getValue = async (key) => {
    try {
        const data = await client.get(key);
        if (data === null || data === undefined) return null;

        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    } catch (error) {
        console.error(error, "\n redis getValue Error");
        throw error;
    }
}

export const ttl = async (key) => {
    try {
        return await client.ttl(key);
    } catch (error) {
        console.error(error, "\n redis ttl Error");
        throw error;
    }
}

export const expire = async ({ key, ttl }) => {
    try {
        return await client.expire(key, ttl);
    } catch (error) {
        console.error(error, "\n redis expire Error");
        throw error;
    }
}

export const deleteKey = async (key) => {
    try {
        return await client.del(key);
    } catch (error) {
        console.error(error, "\n redis deleteKey Error");
        throw error;
    }
}

export const keys = async (key) => {
    try {
        return await client.keys(`${key}*`);
    } catch (error) {
        console.error(error, "\n redis keys Error");
        throw error;
    }
}

export const incr = async (key) => {
    try {
        return await client.incr(key);
    } catch (error) {
        console.error(error, "\n redis incr Error");
        throw error;
    }
}

export const existValue = async (key) => {
    try {
        return await client.exists(key);
    } catch (error) {
        console.error(error, "\n redis exists Error");
        throw error;
    }
}