import mongoose from 'mongoose';

const reportsSchema = mongoose.Schema({
    idList: { type: [String], default: []}, // The ids of the posts that have been reported.
    nameList: { type: [String], default: []}, // The names of the posts that have been reported.
}, 
{ collection: 'reports' })

var Reports = mongoose.model('reports', reportsSchema);

export default Reports;