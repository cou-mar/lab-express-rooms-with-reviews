const express = require('express');
const router = express.Router();

const Review = require('../models/reviews.models')

const Room = require('../models/room.models')

const isNotOwner = require('../middleware/isNotOwner')

const isLoggedIn = require('../middleware/isLoggedIn')

router.get('/:id/add-review', isLoggedIn, isNotOwner, (req, res, next) => {
    res.render('comment-views/add-review.hbs', {roomId: req.params.id})
        //engine is already expecting to look in views folder, but comment-views is a subfolder inside views folder so we need to direct there first before getting to add-review
})

router.post('/:id/add-review', isLoggedIn, isNotOwner, (req, res, next) => {
    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        Room.findByIdAndUpdate(
            req.params.id,
            {$addToSet: {reviews: newReview._id}}
            , {new: true}
            )
            .then((updatedRoom) => {
                console.log('WITH NEW REVIEW', updatedRoom)
                res.redirect('/rooms/rooms-list')
            })
            .catch((err) => {
                console.log(err)
            })
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;