import { Validate } from "../middleware/validate.js";
import {schemas} from "../middleware/validations/schemas.js";
import express from "express";
import authToken from "../middleware/auth.js";
import * as addressController from "../controllers/addressController.js";

const addressRouter = express.Router(({ mergeParams: true }));
// These routes deal with Addresses
addressRouter.get('/:id', authToken('ADDRESS',['ADMIN']), addressController.getAddress);
addressRouter.post('/', addressController.createAddress);
addressRouter.put('/:id', authToken('ADDRESS',['ADMIN']), addressController.updateAddress);
addressRouter.delete('/:id', authToken('ADDRESS',['ADMIN']), addressController.deleteAddress);

export default addressRouter;
