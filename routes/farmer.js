import express from 'express';
import { 
    registerFarmer,
    loginFarmer,
    getFarmerProfile,
    updateFarmerProfile,
    getAllFarmers,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getCropRecommendation, showCropRecommendation } from '../controllers/cropController.js';

const router = express.Router();

// Farmer routes
router.post('/register', registerFarmer);
router.post('/login', loginFarmer);
router.get('/profile/:id', getFarmerProfile);
router.put('/profile', authMiddleware, updateFarmerProfile);
router.get('/all', getAllFarmers);

router.post('/crop-recommendation/:id', authMiddleware, getCropRecommendation);
router.get('/crop-recommendation/:id', authMiddleware, showCropRecommendation);
export default router;
