import express from 'express';
import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import Blacklist from '../models/blacklist.js';
import Reports from '../models/reports.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id_: -1 }).limit(LIMIT).skip(startIndex);  

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await PostMessage.find({ name });

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    // Pull from the database the "blacklist" namespace, then get the "words" array from it.
    const blacklist = await Blacklist.findOne({ namespace: "blacklist" });
    const words = blacklist.words;
    // Check if the content contains any of the words in the "words" array.
    const containsBlacklistedWords = words.some(word => post.message.includes(word));

    if (containsBlacklistedWords) {
        res.status(403).json({ message: "The post contains blacklisted words." });
    } else {


    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })


    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    // Pull from the database the "blacklist" namespace, then get the "words" array from it.
    const blacklist = await Blacklist.findOne({ namespace: "blacklist" });
    const words = blacklist.words;
    // Check if the comment contains any of the words in the "words" array.
    const messagecontainsBlacklistedWord = words.some((word) => message.includes(word));
    const titlecontainsBlacklistedWord = words.some((word) => title.includes(word));
    const tagscontainsBlacklistedWord = words.some((word) => tags.includes(word));
    if (messagecontainsBlacklistedWord || titlecontainsBlacklistedWord || tagscontainsBlacklistedWord) {
        return res.status(403).json({ message: "Comment contains blacklisted word." });
    }else {

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

// Reports a post by id.
// Appends the post id to the reports array in the database.
// Then opens a popup saying that the post has been reported.
export const reportPost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`); // Check if the id is valid.

    // Pull from the database the "reports" namespace, then get the "idList" array from it.
    const reports = await Reports.findOne({ namespace: "reports" }); // get the reports namespace
    const idList = reports.idList; // get the idList array from the database
    const nameList = reports.nameList; // get the nameList array from the database

    // Check if the post id is already in the "idList" array.

    const isPostReported = idList.includes(String(id)); // Returns true if the post id is in the array.

    if (!isPostReported) { // If the post id is not in the "idList" array, then add it.
        const reportedPost = await PostMessage.findById(id);

        // Append the post id to the "idList" array as a string.
        idList.push(String(id));
        // Append the post creator to the "nameList" array as a string.
        nameList.push(String(reportedPost.title));

        // Update the "reports" namespace in the database.
        await Reports.findOneAndUpdate({ namespace: "reports" }, { idList, nameList}, { new: true });


        res.json({ message: "Post reported successfully." });
    }
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    // Pull from the database the "blacklist" namespace, then get the "words" array from it.
    const blacklist = await Blacklist.findOne({ namespace: "blacklist" });
    const words = blacklist.words;
    // Check if the content contains any of the words in the "words" array.
    const containsBlacklistedWord = words.some((word) => value.includes(word));
    if (containsBlacklistedWord) {
        return res.status(403).json({ message: "Comment contains blacklisted word." });
    }else {


    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
    }
};

export const deleteCommentPost = async (req, res) => { 
    const { id } = req.params;
    const { commentIndex } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    post.comments.pull(post.comments[commentIndex]);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json({ message: "Comment deleted successfully." })
}

export default router;