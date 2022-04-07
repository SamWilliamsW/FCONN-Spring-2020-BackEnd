import express from 'express';

import auth from "../middleware/auth.js";
import { getRestaurants, getRestaurant, deleteMessage, messageBoard } from '../controllers/restaurants.js';
const router = express.Router();

router.get('/:id', getRestaurant);
router.get('/', getRestaurants); 
router.patch('/:id/deleteMessage', auth, deleteMessage) 
router.post('/:id/message', messageBoard);
// router.patch('/:id/reportMessage', auth, reportMessage);
//router.get('/', addRestaurant);

export default router; 