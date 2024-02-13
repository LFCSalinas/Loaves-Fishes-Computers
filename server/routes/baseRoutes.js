import { Validate } from "../middleware/validate.js";
import * as loginController from "../controllers/loginController.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";

const baseRouter = express.Router();
// These routes do not require authenticated users
baseRouter.post('/login', Validate(schemas.loginSchema), loginController.login);


export default baseRouter;
