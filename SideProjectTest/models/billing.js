const mongoose = require('mongoose');

// Schema // 

const Schema = mongoose.Schema; 
const bookingSchema = new Schema({ 
    // Server will warn "unique:true is depreciated" but still workds to prevent duplicates
    name: {type: String, required: true, unique : true}, 
    email: String, 
    pricing: String, 
    totalTime: String, 
    holder: String
});
// Model // 
const bookingpost = mongoose.model('booking_records', bookingSchema);

module.exports = bookingpost; 