// Given Express Router from app.mjs, set up routes.
import userRouter from './userRoutes.js'
import { validBrowser } from "../middleware/validations/validBrowser.js";
import baseRouter from "./baseRoutes.js";
import volunteerRouter from "./volunteerRoutes.js";

export const init_routes = (app) => {
    app.use(validBrowser)
    app.use(baseRouter)
    app.use('/user', userRouter)
    app.use('/:id/volunteer', volunteerRouter) // User_id for Auth, then volunteer endpoint. Ex: get /6/volunteer/6

    app.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });
}
