import { Validate } from "../middleware/validate.js";
import * as userController from "../controllers/userController.js";
import * as loginController from "../controllers/loginController.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/login' ,loginController.login);
userRouter.get('/verified', authToken, loginController.verified)

userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUser);
userRouter.post('/', Validate(schemas.createUserSchema), userController.createUser);
userRouter.patch('/:id', Validate(schemas.createUserSchema), userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);


export default userRouter;
