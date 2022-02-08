import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: Number, required: true},
    phone: {type: String, required: false}
})

var Restaurants = mongoose.model('Restaurant', restaurantSchema);

export default Restaurants;