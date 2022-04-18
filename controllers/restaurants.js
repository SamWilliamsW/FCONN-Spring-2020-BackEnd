import express from 'express';
import mongoose from 'mongoose';
import Restaurants from '../models/restaurants.js'
import Blacklist from '../models/blacklist.js';


const router = express.Router();


// Gets all the restaurants from the database and returns them
export const getRestaurants = async (req, res) => {    
    const { page } = req.query;

    try {
        const LIMIT = 8; // number of restaurants per page
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

// Everything message / bulletin board related vvvvv

// export const reportMessage = async (req, res) => {
//     const { id } = req.params;

//     if (!req.userId) {
//         return res.json({ message: "Unauthenticated" });
//       }

//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Message with id: ${id}`); // Check if the id is valid.

//     // Pull from the database the "reports" namespace, then get the "idList" array from it.
//     const reports = await Reports.findOne({ namespace: "reports" }); // get the reports namespace
//     const idList = reports.idList; // get the idList array from the database
//     const nameList = reports.nameList; // get the nameList array from the database

//     // Check if the message id is already in the "idList" array.

//     const isMessageReported = idList.includes(String(id)); // Returns true if the post id is in the array.

//     if (!isMessageReported) { // If the post id is not in the "idList" array, then add it.
//         const reportedMessage = await restaurants.findById(id);

//         // Append the restaurant id to the "idList" array as a string.
//         idList.push(String(id));
//         // Append the restaurant creator to the "nameList" array as a string.
//         nameList.push(String(reportedRestaurant.title));

//         // Update the "reports" namespace in the database.
//         await Reports.findOneAndUpdate({ namespace: "reports" }, { idList, nameList}, { new: true });


//         res.json({ message: "Restaurant reported successfully." });
//     }
// }

export const messageBoard = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    // Pull from the database the "blacklist" namespace, then get the "words" array from it.
    const blacklist = await Blacklist.findOne({ namespace: "blacklist" });
    const words = blacklist.words;
    // Check if the content contains any of the words in the "words" array.
    const containsBlacklistedWord = words.some((word) => value.includes(word));
    if (containsBlacklistedWord) {
        return res.status(403).json({ message: "Messages contains blacklisted word." });
    }else {


    const restaurant = await Restaurants.findById(id);

    restaurant.messages.push(value);

    const updatedMessage = await Restaurants.findByIdAndUpdate(id, restaurant, { new: true });

    res.json(updatedMessage);
    }
};

export const deleteMessage = async (req, res) => { 
    const { id } = req.params;
    const { messageIndex } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No message with id: ${id}`);

    const restaurant = await Restaurants.findById(id);

    restaurant.messages.pull(restaurant.messages[messageIndex]);
    const updatedMesage = await Restaurants.findByIdAndUpdate(id, restaurant, { new: true });

    res.json({ message: "Message deleted successfully." })
}

export default router;