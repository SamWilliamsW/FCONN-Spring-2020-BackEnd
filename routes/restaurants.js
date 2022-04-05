import express from 'express';

import { getRestaurants, getRestaurant } from '../controllers/restaurants.js';
const router = express.Router();

router.get('/:id', getRestaurant);
router.get('/', getRestaurants); 
//router.get('/', addRestaurant);

export default router; 