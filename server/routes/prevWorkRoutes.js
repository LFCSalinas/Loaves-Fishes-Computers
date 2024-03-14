import { Validate } from "../middleware/validate.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";
import * as prevWorkController from "../controllers/prevWorkController.js";

const prevWorkRouter = express.Router(({ mergeParams: true }));
// These routes deal with Volunteer and identifying models

prevWorkRouter.post('/', authToken('VOLUNTEER', ['ADMIN']), prevWorkController.createWorkHistory);
prevWorkRouter.get('/:id', authToken('VOLUNTEER', ['ADMIN']), prevWorkController.getWorkHistory);
// prevWorkRouter.put('/:id', authToken('VOLUNTEER',['ADMIN']), prevWorkController.updateVolunteer);
// prevWorkRouter.delete('/:id', authToken(['ADMIN']), prevWorkController.deleteVolunteer);

export default prevWorkRouter;
