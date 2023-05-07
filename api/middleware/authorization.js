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
       
         "cookie jwt": req.headers.cookie.split("=")[1], "cookie": req.headers.cookie
         let cookieJWT = undefined
         let cookiesArray = req.headers.cookie.split(";")
         for(let i=0;i<cookiesArray.length;i++) {
             let cookieJWTKey = cookiesArray[i].split("=")[0]
            if(cookieJWTKey === "jwt") {
                cookieJWT = cookiesArray[i].split("=")[1]
            }
         }
        */
        
         let cookieJWT = undefined
         let cookiesArray = req.headers.cookie.split(";")
         for(let i=0;i<cookiesArray.length;i++) {
             let cookieJWTKey = cookiesArray[i].split("=")[0]
            if(cookieJWTKey === "jwt") {
                cookieJWT = cookiesArray[i].split("=")[1]
            }
         }
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

        res.status(400).json({"user": error.message, "cookie":req.headers.cookie, "jwt 2": cookieJWT});
    }
}

module.exports = {
    authorize
}