const express = require('express');
const router = express.Router();

const User = require('../models/user.models')

const bcryptjs = require('bcryptjs');

const saltRounds = 10

router.get('/signup', (req, res, next) => {
    res.render('auth-views/signup')
})

router.post('/signup', (req, res, next) => {

    //ensuring each part of the form is filled out
    if(!req.body.fullName || !req.body.email || !req.body.password) {
        //if each is not filled out, render sign up page again
        res.render('auth-views/signup', {message: "You must fill out all fields"})
        return;
        }

    const salt = bcryptjs.genSaltSync(saltRounds)
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt)

    //checking to see whether user already exists in DB
    User.findOne({email: req.body.email})
        .then((foundUser) => {
            //if a user is found, display message
            if (foundUser){
                res.render('auth-views/signup', {message: 'You have already signed up'})
                return;
            //if no user found, proceed to create user with inputted values on form
            } else { 
                User.create({
                    fullName: req.body.fullName,
                    email: req.body.email,
                    password: hashedPassword
                })
                //direct them to login page once values inputted
                .then(() => {
                    res.render('/auth/login')
                })
                .catch((err) => {
                    console.log(err)
                })
            }
    })
    .catch((err) => {
        console.log(err)
    })
})

router.get('/login', (req, res, next) => {
    res.render('auth-views/login.hbs')
})

router.post('/login', (req, res, next) => {
    if(!req.body.email || !req.body.password){
        res.render('auth-views/login', {message: "Both fields are required"})
        return;
    }

    User.findOne({email: req.body.email})
    .then((foundUser) => {
        if (!foundUser){
            res.render('auth-views/login', {message: "This user does not exist"})
        } else {
            let correctPassword = bcryptjs.compareSync(req.body.password, foundUser.password);
            if(correctPassword){
                req.session.user = foundUser;
                res.render('index', {message: "You have successfully logged in"})
            } else {
                res.render('auth-views/login', {message: "Incorrect email or password"})
            }
        }
    })
})

router.get('/logout', (req, res, next) => {
    //this will clear the cookie from the DB and end the session
    req.session.destroy()
    res.render('/auth-views/login', {message: "You have successfully logged out"})
})

module.exports = router