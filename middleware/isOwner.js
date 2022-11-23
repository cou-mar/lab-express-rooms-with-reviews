const Room = require('../models/room.models');

const isOwner = (req, res, next) => {
    Room.findById(req.params.id)
    .then((foundRoom) => {
        if(String(foundRoom.owner) === req.session.user._id){
            next()
        } else{
            // res.redirect('/rooms/rooms-list')
            res.render('room-views/all-rooms.hbs', {message: "You do not have permission."})
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = isOwner;