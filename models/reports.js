import mongoose from 'mongoose';

const reportsSchema = mongoose.Schema({
    idList: { type: [String], default: []},
    nameList: { type: [String], default: []},
}, 
{ collection: 'reports' })

var Reports = mongoose.model('reports', reportsSchema);

export default Reports;