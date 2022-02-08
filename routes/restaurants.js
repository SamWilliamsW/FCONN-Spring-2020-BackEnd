import express from 'express';
import { getRestaurants } from '../controllers/restaurants';
const router = express.Router();


router.get('/restaurants', getRestaurants);