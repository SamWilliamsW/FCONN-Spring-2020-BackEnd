import mongoose from 'mongoose';

const blacklistSchema = mongoose.Schema({
    words: { type: [String], default: []},
}, 
{ collection: 'blacklist' })

var Blacklist = mongoose.model('blacklist', blacklistSchema);

export default Blacklist;