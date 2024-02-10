import { schemas } from "./validations/schemas.js"

export const Validate = (schema) => {
    return async function(req, res, next) {
        try {
            req.body = await schema.validateAsync(req.body);
            next();
        } catch (err) {
            if (err.isJoi) {
                const validationError = new Error(err.message);
                validationError.statusCode = 422;
                return next(validationError);
            }
            const serverError = new Error("Internal Server Error");
            serverError.statusCode = 500;
            next(serverError);
        }
    };
};
