import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    id: { type: String },
    isAdmin: { type: Boolean, required: false},
});

var User = mongoose.model("User", userSchema);

export default User;