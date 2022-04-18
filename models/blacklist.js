import mongoose from 'mongoose';

const blacklistSchema = mongoose.Schema({
    words: { type: [String], default: []}, // An array of strings. These will be the words that will be blacklisted.
}, 
{ collection: 'blacklist' })

var Blacklist = mongoose.model('blacklist', blacklistSchema);

export default Blacklist;