// Given Express Router from app.mjs, set up routes.
import userRouter from './userRoutes.js'
import { validBrowser } from "../middleware/validations/validBrowser.js";

export const init_routes = (app) => {
    app.use(validBrowser)
    app.use('/user', userRouter)

    app.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });
}
