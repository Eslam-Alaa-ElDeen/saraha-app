import { processMulterUpload } from "../common/utils/multer/local.multer.js";

export const uploadMiddleware = ({isRequired=true, multerMiddleware, validation = [], customPath = 'general' } = {}) => {
    return (req, res, next) => {
        multerMiddleware(req, res, async (error) => {
            try {
                if (error) {
                    return next(new Error(error.message, { cause: { status: 400 } }));
                }

                if(
                    isRequired
                    &&(
                        !req.file &&
                        (!Array.isArray(req.files) && !req.files.length)&&
                        (typeof req.files !== "object" && !Object.keys(req.files)?.length)
                    )
                )
                    next(new Error("file is required",{cause:{status:400}}))

                await processMulterUpload({ req, validation, customPath });
                next();
            } catch (err) {
                next(err);
            }
        });
    };
};
