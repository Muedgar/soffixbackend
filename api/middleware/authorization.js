const jwt = require('jsonwebtoken');

const authorize = async (req,res,next) => {
    try {
        // res.clearCookie()
        if(!req.headers.cookie) {
            throw new Error("Not Logged in")
        }

        // get cookie local req.headers.cookie.split("=")[1]
        // get cookie on render
        /*
        let cookieJWT = req.headers.cookie.split(";")[3].split("=")[1]
         "cookie jwt": req.headers.cookie.split("=")[1], "cookie": req.headers.cookie
        */
        let cookieJWT = req.headers.cookie.split(";")[3].split("=")[1]
        jwt.verify(cookieJWT, process.env.JWT_SECRET, function(err, decodedToken) {
            if(err) { throw new Error("Couldn't get user data because cookie is probably retrieved using a wrong programming method. ") }
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