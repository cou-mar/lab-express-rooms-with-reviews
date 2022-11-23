var express = require("express");
var router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isOwner = require('../middleware/isOwner');

const Room = require("../models/room.models");

router.get('/create-room', (req, res, next) => {
    res.render('room-views/create-room.hbs')
});

router.post('/create-room', isLoggedIn,(req, res, next) => {
    // (console.log("SESSION USER", req.session.user))
    Room.create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        owner: req.session.user._id
    })
    .then((createdRoom) => {
        console.log('THIS IS THE ROOM I CREATED', createdRoom)
        res.redirect('/rooms/rooms-list')
    })
    .catch((err) => {
        console.log(err)})
});

router.get('/rooms-list', (req, res, next) => {
    Room.find()
    .populate({
        path: "reviews",
        populate: {
            path: "user",
        },
    })
    .then((foundRooms) => {
        res.render('room-views/all-rooms.hbs', {foundRooms})
    })
    .catch((err) => {
        console.log(err)
    })
})

// :id only needs to correspond to itself in the route (with the req.params). it is NOT tied to our form in the all-rooms.hbs
router.post('/:id/delete-room', isOwner, (req, res, next) => {
    Room.findById(req.params.id)
    .then((foundRoom) => {
        foundRoom.delete()
        res.redirect('/rooms-list')
    })
    .catch((err) => {
        console.log(err)
    })
});

router.get('/:id/edit-room', isOwner, (req, res, next) => {
    Room.findById(req.params.id)
    .then((foundRoom) => {
        console.log('THIS IS THE ROOM I WANT TO EDIT');
        res.render('room-views/edit-room.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
    })
});

router.post('/:id/edit-room', isOwner, (req, res, next) => {
    Room.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    },
    {new: true}
        //will show the object after the changes have been made, ie the new true object. we want to immediately use these new edits
    )
    .then((updatedRoom) => {
        console.log("CHANGED ROOM:", updatedRoom)
        res.redirect('/rooms/rooms-list')
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;