// Require mongoose
var mongoose = require('mongoose')
// Create a schema class
var Schema = mongoose.Schema

// Create the Note schema
var NoteSchema = new Schema({
  // Just a string
  body: {
    type: String
  },
}, {timestamps: true})

NoteSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('Article').update({ note: this._id }, {$unset: {note:1}}, next)
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Note = mongoose.model('Note', NoteSchema)

// Export the Note model
module.exports = Note