

export const Validation = (schema) => {
    return (req, res, next) => {
        const arrError = [];
        for (const key of Object.keys(schema)) {
            const { error } = schema[key].validate(req[key], {
                abortEarly: false,
                convert: true
            });

            if (error) {
                error.details.forEach((err) => {
                    arrError.push({
                        message: err.message,
                        path: err.path.join("."),
                        key
                    });
                });
            }
        }

        if (arrError.length) {
            return res.status(400).json({
                message: "Validation failed. Please correct the highlighted fields.",
                arrError
            });
        }

        return next();
    };
};

