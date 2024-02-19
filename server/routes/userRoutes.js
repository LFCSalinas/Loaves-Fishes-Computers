import { Validate } from "../middleware/validate.js";
import * as userController from "../controllers/userController.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";

const userRouter = express.Router();
// These routes deal with User models
userRouter.get('/', authToken(['ADMIN']), userController.getUsers);
userRouter.get('/:id', authToken(['ADMIN']), userController.getUser);
userRouter.post('/', Validate(schemas.createUserSchema), userController.createUser);
userRouter.patch('/:id', authToken(['ADMIN']), Validate(schemas.createUserSchema), userController.updateUser);
userRouter.delete('/:id', authToken(['ADMIN']), userController.deleteUser);



export default userRouter;
