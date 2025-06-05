const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: String,
  type: String,
  question: String,
  options: [String],
  required: Boolean
}, { _id: false });

const surveySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
  questions: [questionSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  published_at: { type: Date }
});

module.exports = mongoose.model('Survey', surveySchema);
