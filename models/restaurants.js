import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: Number, required: true},
    phone: {type: String, required: true},
    description: {type: String, required: true},
    businessHoursStart: {type: [Number], required: true},
    businessHoursEnd: {type: [Number], required: true},
    tags: {type: [String], required: true},
    delivery: {type: Boolean, required: true},
    takeout: {type: Boolean, required: true},
    dinein: {type: Boolean, required: true},
    comments: {type: Array, required: true},
    menuLink: {type: String, required: true},
    photo: {type: String, required: true},
},
{ collection: 'restaurants'})

var Restaurants = mongoose.model('restaurants', restaurantSchema);

export default Restaurants;