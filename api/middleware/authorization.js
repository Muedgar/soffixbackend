const jwt = require('jsonwebtoken');

const authorize = async (req,res,next) => {
    try {
        // res.clearCookie()
        if(!req.headers.cookie) {
            throw new Error("Not Logged in")
        }
        jwt.verify(req.headers.cookie.split("=")[1], process.env.JWT_SECRET, function(err, decodedToken) {
            if(err) { throw new Error("Couldn't get user data") }
            else {
                if(decodedToken.data.email.toLowerCase().trim() !== process.env.ADMIN_EMAIL.toLowerCase().trim()) {
                    throw new Error("You are not authorized for this action")
                }else if(decodedToken.data.email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim()) {
                    next() 
                }else {
                    throw new Error("You are not authorized for this action")
                }
                 // Add to req object
            }
          });
        
        
    } catch (error) {

        res.status(400).json({"user": error.message});
    }
}

module.exports = {
    authorize
}