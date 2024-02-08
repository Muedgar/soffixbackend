const jwt = require('jsonwebtoken');

const authorize = async (req,res,next) => {
    if(!req.query.jwt) {
         
         return res.status(400).json({"user": 'Unauthorized'});
        }
    
    next()
}

module.exports = {
    authorize
}