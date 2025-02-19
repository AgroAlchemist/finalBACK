import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createRental, getRents, deleteRent, getLocations } from '../controllers/rentController.js';
const router = express.Router();
router.use(express.json());
router.post('/create', authMiddleware, createRental);
router.get('/all', authMiddleware, getRents);

router.delete('/:rentId', authMiddleware, deleteRent);
router.get('/locations', authMiddleware, getLocations);

export default router;
