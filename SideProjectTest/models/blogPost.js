const mongoose = require('mongoose');
var mongo = require('mongodb');


// Schema//
const Schema = mongoose.Schema;
const blogpostSchema = new Schema({
    //Server will warn "unique:true is depreciated" but still works to prevent duplicates//
    name: {type: String, required: true, unique : true},
    email: String, 
    phone: String, 
    credits: Number, 
    creditsReset: Number, 
    creditUser: Boolean, 
    canGoNegative: Boolean

    
});

// Model//
const blogpost = mongoose.model('user_credits', blogpostSchema);
//client_info is the name of the collection inside the database//

module.exports =  blogpost;