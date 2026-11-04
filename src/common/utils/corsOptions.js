import { ALLOWED_ORIGINS } from "../../../config/config.service.js";

export let corsOptions = {
    origin: function (origin, callback) {
        if (ALLOWED_ORIGINS.includes(origin) || origin===undefined) {
        callback(null, true);
        } else {
        callback(new Error("Not allowed by CORS & Unauthorized origin"), false);
        }
    }
}