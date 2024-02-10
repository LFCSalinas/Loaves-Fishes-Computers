import express from 'express'
import adminController from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

export const adminRouter = express.Router();

adminRouter.get('/admin', protect, admin, adminController.admin);
adminRouter.get('/users', protect, admin, adminController.getAllUsers);
adminRouter.delete('/user/:id', protect, admin, adminController.deleteUser);
