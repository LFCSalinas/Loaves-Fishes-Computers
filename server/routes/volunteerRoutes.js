import { Validate } from "../middleware/validate.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";
import * as volunteerController from "../controllers/volunteerController.js";

const volunteerRouter = express.Router(({ mergeParams: true }));
// These routes deal with Volunteer and identifying models

volunteerRouter.post('/', authToken(['ADMIN']), volunteerController.register);


export default volunteerRouter;
