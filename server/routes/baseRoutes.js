import { Validate } from "../middleware/validate.js";
import * as loginController from "../controllers/loginController.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import {jwtLogin} from "../controllers/loginController.js";
import authToken from "../middleware/auth.js";

const baseRouter = express.Router(({ mergeParams: true }));

baseRouter.post('/login', Validate(schemas.userSchema, ['username', 'password']), loginController.login);
baseRouter.get('/token', authToken('USER', ['USER', 'ADMIN']), loginController.jwtLogin);


export default baseRouter;
