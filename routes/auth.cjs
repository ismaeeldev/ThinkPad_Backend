const express = require('express');
const User = require('../models/User.cjs');
const fetchuser = require('../middleware/fetchuser.cjs');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config()


//create user -- end point
router.post('/createuser', [
    //validator
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })

], async (req, res) => {
    const JWT_SECRET = process.env.JWT_TOKEN;//json web token 

    //if there are error send bad request....
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success: "false", title: "Invalid Input ", error: "Input the Credentials with proper limit" });
    }

    try {

        //check email already exist or not ....
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: "false", title: "Invalid Credentials ", error: "Sorry a user with this email already exit.." })
        }

        //password convert to hash using bcryptjs

        const salt = await bcrypt.genSalt(10);
        let secretPass = await bcrypt.hash(req.body.password, salt);


        //create new user 

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secretPass,
        });


        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: "true", authtoken: authToken });
    } catch (error) {
        console.error("Error occured in creating user ", error);
        res.status(500).json({ title: "Internel Server Error", success: false, error: "Some Problem occur in Internel Sevrer. Please wait and keep Supporting .." })
    }
})


//Login--end point

router.post('/login', [
    // Validator
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    const JWT_SECRET = process.env.JWT_TOKEN;//json web token 

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ title: "Email not Exist", success: "false", error: "Sorry, a user with this email does not exist." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ title: "Invalid Email or Password ", success: "false", error: "Please login with correct credentials." });
        }

        const data = {
            user: {
                id: user.id,
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: "true", authtoken: authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ title: "Internel Server Error", success: false, error: "Some Problem occur in Internel Sevrer. Please wait and keep Supporting .." });
    }
});


//get user -- End point 

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userid = req.user.id;
        const user = await User.findById(userid).select('-password');
        res.send(user);
    } catch (error) {
        res.status(400).send({ title: "Internel Server Error", success: false, error: "Some Problem occur in Internel Sevrer. Please wait and keep Supporting .." });
    }
});




//login-update --- end point 

router.put('/update-login', fetchuser, [
    // Validators
    body('name', 'Name should not be empty').optional(),
    body('email', 'Enter a valid Email').isEmail(),
    body('newPassword', 'Password should be at least 5 characters long').isLength({ min: 5 }).optional(),
    body('confirmPassword', 'Confirm password should match new password').custom((value, { req }) => value === req.body.newPassword),
], async (req, res) => {


    const JWT_SECRET = process.env.JWT_TOKEN;//json web token 


    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array(), title: "Password Required", success: false, error: "Please enter a password to ensure security " });
    }

    const { email, name, newPassword } = req.body;

    try {
        // Find the user by ID from the token
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ title: "User Not Found", success: false, error: "User not found." });
        }

        // Check if the email already exists in the database
        if (email && email !== user.email) {
            let emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ title: "Email Already Taken", success: false, error: "A user with this email already exists." });
            }
            user.email = email;
        }

        //update the name 
        if (name && name !== user.name) {
            user.name = name;
        }

        // Hash the new password before saving
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        const data = {
            user: {
                id: user.id,
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: "true", message: "Login details updated successfully.", authtoken: authToken });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ title: "Internal Server Error", success: false, error: error.message });
    }
});


module.exports = router