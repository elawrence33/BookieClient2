const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// Creating Schema 
const UsersSchema = mongoose.Schema;
const usersSchema = new UsersSchema({
    name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    }, 
    password: { 
        type: String, 
        required: true
    }, 
    register_date: { 
        type: Date, 
        default: Date.now
    }
    
    
});

// Model//
const users = mongoose.model('Users', usersSchema);
// Users is the name of the collection that will hold emails and passwords for Authentication

module.exports =  users;