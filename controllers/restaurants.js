import express from 'express';
import mongoose from 'mongoose';
import Restaurants from '../models/restaurants.js'

const router = express.Router();

//Not being used yet.

export const getRestaurants = async (req, res) => {    
    try {

        const total = await Restaurants.countDocuments({});
        const restaurants = await Restaurants.find().sort({ _id: -1 });

        res.json({ data: restaurants});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurant = await Restaurants.findById(id);

        res.status(200).json(restaurant);
    }
    catch {
        res.status(404).json({ message: error.message });
    }
}

export const addRestaurant = async (req, res) => {
    const restaurant = req.body;

    const newRestaurant = new Restaurants({ ...restaurant, name: req.name});

    try {
        await newRestaurant.save();

        res.status(201).json(newRestaurant);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export default router;