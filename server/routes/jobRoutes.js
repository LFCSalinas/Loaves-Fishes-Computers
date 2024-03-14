import { Validate } from "../middleware/validate.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";
import * as jobController from "../controllers/jobController.js";

const jobRouter = express.Router(({ mergeParams: true }));
// These routes deal with Addresses
jobRouter.get('/:id', authToken('JOB',['ADMIN']), jobController.getJob);
jobRouter.post('/', Validate(schemas.jobSchema, ['company', 'title', 'years', 'duties']), jobController.createJob);
jobRouter.put('/:id', authToken('JOB',['ADMIN']), Validate(schemas.jobSchema), jobController.updateJob);
jobRouter.delete('/:id', authToken('JOB',['ADMIN']), jobController.deleteJob);

export default jobRouter;
