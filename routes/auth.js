const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Validation

router.post('/register', async (req, res) => {

    //Validation before creating a user
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user already exists in the database
    const userExists = await User.findOne({ email: req.body.email})
    if(userExists) return res.status(400).send('Email already exists');

    
    

    //Hash Passwords
    const salt  = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }
    catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //Validation 
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Email not found');
    
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is incorrect');

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET || config.TOKEN_SECRET, { expiresIn: '30m' })

    res.send(token);
})


module.exports = router;