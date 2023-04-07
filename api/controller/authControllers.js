const User = require('../model/user');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email:'', password:''};

//incorrect email
if(err.message == 'incorrect email') {
    errors.email = 'that email is not registered';
}
//incorrect password
if(err.message == 'incorrect password') {
    errors.password = 'that password is incorrect';
}

    // duplicate error code
    if(err.code==11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if(err.message.includes('Please enter valid email')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}



const maxAge = 3 * 24 * 60 * 60;
const createToken = (data) => {
    return jwt.sign({data},process.env.JWT_SECRET, {expiresIn: maxAge});
}




const signup_post = async (req,res) => {
    let data = {};
    try {
        const user = await User.create(req.body);

        const token = createToken({id: user._id, email: user.email});
        // after creating a new user
        // create a jwt and send it in a cookie
        data = {user: user, jwt: token};
        console.log("trying to signup",data);
        
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
       
        
        res.status(201).json({user: user, status: 'user created successfully.'});
        //
    } catch (error) {
        let errors = handleErrors(error);
        if(error.message === 'Expected "payload" to be a plain object.') {
            errors = data;
           
            res.status(201).json(data);
            return;
        }
            res.status(500).json(errors);
        
        
    }
}

const login_post = async(req, res) => {
    const {email,password} = req.body;
    
    try {
        const user = await User.login(email, password);
        // after creating a new user
        // create a jwt and send it in a cookie
        const token = createToken({id: user._id, email: user.email});
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        console.log("logged in");
        res.status(200).json({user, status: 'user logged in'});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}


const getLoggedInUser = async (req,res) => {
    try {
        // res.clearCookie()
        console.log(req.headers)
        if(!req.headers.cookie) {
            throw new Error("Not Logged in")
        }
        jwt.verify(req.headers.cookie.split("=")[1], process.env.JWT_SECRET, function(err, decodedToken) {
            if(err) { throw new Error("Couldn't get user data") }
            else {
                res.status(200).json(decodedToken)  // Add to req object
            }
          });
        
        
    } catch (error) {
        res.status(400).json({"user": error.message});
    }
}

const logout = async (req,res) => {
    try {
        if(!req.headers.cookie) {
            throw new Error("Not Logged in")
        }
        res.status(200).clearCookie('jwt').json({message: 'user logged out'})
    } catch (error) {
        res.status(400).json({"user": error.message});
    }
}

const changePassword = async (req,res) => {
    try {
        const salt = await bcrypt.genSalt();
        let newpassword = await bcrypt.hash(req.body.password, salt);
        await User.findOneAndUpdate({email: process.env.ADMIN_EMAIL},{password: newpassword},{new: true})
        .then(d => {

            res.status(200).json({message: "Password changed", d})
        })
        .catch(e => new Error("Password change failed"))
    }catch (error) {
        res.status(400).json({"user": error.message});
    }
}

const clearUserTable = async (req,res) => {
    try {
        await User.deleteMany({})
        .then(d => {
            res.status(200).json({message: "User table cleared"})
        })
        .catch(e => new Error("User table clearing failed"))
    }catch (error) {
        res.status(400).json({"user": error.message});
    }
}

module.exports = {
    signup_post,
    login_post,
    logout,
    getLoggedInUser,
    clearUserTable,
    changePassword
}