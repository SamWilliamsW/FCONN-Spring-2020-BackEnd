import express from 'express';
import mongoose from 'mongoose';
import Restaurants from '../models/restaurants.js'

const router = express.Router();

//Not being used yet. 

export const getRestaurants = async (req, res) => {    
    const { page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await Restaurants.countDocuments({});
        // Find all restaurants
        const restaurants = await Restaurants.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex); 
        // If no restaurants are found, give an array of ["No restaurants found"]
        if (restaurants.length === 0) {
            res.json({ data: ["No restaurants found"] });
        } 
        // Log the total number of restaurants
        res.json({ data: restaurants, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
        // res.json({ data: restaurants});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        // Otherwise we find the restaurant with the given id
        const restaurant = await Restaurants.findById(id);

        // If no restaurant is found, give an array of ["No restaurant found"]
        if (!restaurant) {
            res.json({ restaurant: ["No restaurant found"] });
        }


        res.status(200).json(restaurant);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/**
export const addRestaurant = async (req, res) => {
    const restaurant = req.body;

    const newRestaurant = new restaurants({ ...restaurant, name: req.name});

    try {
        await newRestaurant.save();

        res.status(201).json(newRestaurant);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}
*/

export default router;