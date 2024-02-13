import { Validate } from "../middleware/validate.js";
import * as userController from "../controllers/userController.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";

const userRouter = express.Router();
// These routes require an authenticated user
userRouter.get('/', authToken(['admin']), userController.getUsers);
userRouter.get('/:id', authToken(['admin']), userController.getUser);
userRouter.post('/', authToken(['admin']), Validate(schemas.createUserSchema), userController.createUser);
userRouter.patch('/:id', authToken(['admin']), Validate(schemas.createUserSchema), userController.updateUser);
userRouter.delete('/:id', authToken(['admin']), userController.deleteUser);


export default userRouter;
