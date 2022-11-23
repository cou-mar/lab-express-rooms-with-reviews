const {Schema, model} = require('mongoose');

const roomSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}] // we will update this field a bit later when we create review model
    //we're referring to MongoDB's objectid type (this is not the same as JS types)
    //the ref is for MDB to know the only IDs that can go in there are IDs of reviews. ie must come from review collection
  });

  const Room = model('Room', roomSchema);

  module.exports = Room;