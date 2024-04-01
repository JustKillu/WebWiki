const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: String,
  content: String,
  date: { type: Date, default: Date.now }
});

const WikiEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: { 
    data: {
      type: Buffer,
      required: false
    },
    contentType: {
      type: String,
      required: false
    }
  },
  comments: [CommentSchema]
});

module.exports = mongoose.model('WikiEntry', WikiEntrySchema);
