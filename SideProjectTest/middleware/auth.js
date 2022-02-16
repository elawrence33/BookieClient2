const config = require("config");
const jwt = require("jsonwebtoken");

// Whenever you have a function in middleware you need to 
// have req, res, and next as paramerter. Next will pass 
// control off to the next function in the middle ware to 
// continue on. 
function auth(req, res, next) { 
    // const token = req.header('x-auth-token');
    const token = req.body.token;

    // Checking for token: 
    if (!token) { 
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }
    try { 
    // If there is a token, we must verify it: 
    console.log("Before verify");
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log("After verify");
    // Add user from payload
    req.user = decoded; 
    next();

    } catch(e) { 
        res.status(400).json({ msg: 'Token is not valid' })
    }
}

module.exports = auth; 