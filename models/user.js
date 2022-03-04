import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    id: { type: String },
    isAdmin: { type: Boolean, required: false},

    businessName: { type: String, required: false},
    businessAddress: { type: String, required: false},
    businessDescription: { type: String, required: false},
    businessPhoneNumber: { type: String, required: false},
});

var User = mongoose.model("User", userSchema);

export default User;