import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import {userModel} from "./model/index.js"

userModel.syncIndexes

export const connectionDB=async()=>{
    try {
        await mongoose.connect(DB_URI)
        console.log("DB connect successfully 💯");
    } catch (error) {
        console.log("DB connection failed ❌",error);
    }
}