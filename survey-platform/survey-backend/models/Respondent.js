const mongoose = require('mongoose');

const respondentSchema = new mongoose.Schema({
  email: String,
  name: String,
  metadata: {
    type: Object,
    default: {}
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Respondent', respondentSchema);
