import express from 'express';

import { getRestaurants, getRestaurant, addRestaurant } from '../controllers/restaurants.js';
const router = express.Router();

router.get('/:id', getRestaurant);
router.get('/restaurants', getRestaurants);
router.get('/', addRestaurant);

export default router; 