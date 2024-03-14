import { Validate } from "../middleware/validate.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";
import * as contactController from "../controllers/contactController.js";

const contactRouter = express.Router(({ mergeParams: true }));
// These routes deal with Addresses
contactRouter.get('/:id', authToken('CONTACT',['ADMIN']), contactController.getContact);
contactRouter.post('/', Validate(schemas.contactSchema, ['first_name', 'last_name', 'phone', 'relation']), contactController.createContact);
contactRouter.put('/:id', authToken('CONTACT',['ADMIN']), Validate(schemas.contactSchema), contactController.updateContact);
contactRouter.delete('/:id', authToken('CONTACT',['ADMIN']), contactController.deleteContact);

export default contactRouter;
