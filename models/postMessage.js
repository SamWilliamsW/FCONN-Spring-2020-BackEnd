import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    message: {type: String, required: true},
    name: {type: String, required: true},
    creator: {type: String, required: true},
    tags: {type: [String], required: false},
    selectedFile: {type: String},
    likes: { type: [String], default: []},
    comments: { type: [String], default: []},
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;