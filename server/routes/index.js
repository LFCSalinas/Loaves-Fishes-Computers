// Given Express Router from app.mjs, set up routes.
import userRouter from './userRoutes.js'
import { validBrowser } from "../middleware/validations/validBrowser.js";
import baseRouter from "./baseRoutes.js";
import volunteerRouter from "./volunteerRoutes.js";
import contactRouter from "./contactRoutes.js";
import addressRouter from "./addressRoutes.js";
import jobRouter from "./jobRoutes.js";
import prevWorkRouter from "./prevWorkRoutes.js";

export const init_routes = (app) => {
    app.use(validBrowser)
    app.use(baseRouter)
    app.use('/user', userRouter)
    app.use('/volunteer', volunteerRouter)
    app.use('/contact', contactRouter)
    app.use('/address', addressRouter)
    app.use('/job', jobRouter)
    app.use('/prevwork', prevWorkRouter)

    app.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });
}
