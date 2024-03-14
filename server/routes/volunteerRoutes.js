import { Validate } from "../middleware/validate.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";
import * as volunteerController from "../controllers/volunteerController.js";

const volunteerRouter = express.Router(({ mergeParams: true }));
// These routes deal with Volunteer and identifying models

// volunteerRouter.get('/', authToken(['ADMIN']), volunteerController.getVolunteers);
volunteerRouter.get('/:id', authToken('VOLUNTEER', ['ADMIN']), volunteerController.getVolunteer);
volunteerRouter.post('/', authToken('VOLUNTEER', ['ADMIN']), volunteerController.createVolunteer);
volunteerRouter.put('/:id', authToken('VOLUNTEER',['ADMIN']), Validate(schemas.volunteerSchema), volunteerController.updateVolunteer);
// volunteerRouter.delete('/:id', authToken(['ADMIN']), volunteerController.deleteVolunteer);

export default volunteerRouter;
