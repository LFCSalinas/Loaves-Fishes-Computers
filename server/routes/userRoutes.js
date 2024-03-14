import { Validate } from "../middleware/validate.js";
import * as userController from "../controllers/userController.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";

const userRouter = express.Router(({ mergeParams: true }));
// These routes deal with User models
userRouter.get('/', authToken('USER',['ADMIN']), userController.getUsers);
userRouter.get('/:id', authToken('USER',['ADMIN']), userController.getUser);
userRouter.post('/',  Validate(schemas.userSchema, ['username', 'email', 'password', 'pwd_confirm']), userController.createUser);
userRouter.put('/:id', authToken('USER',['ADMIN']), Validate(schemas.userSchema), userController.updateUser);
userRouter.delete('/:id', authToken('USER',['ADMIN']), userController.deleteUser);

export default userRouter;
