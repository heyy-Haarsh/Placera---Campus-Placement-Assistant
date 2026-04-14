const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  desc: { type: String, default: '' },
  questions: { type: String, default: '' },
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  // Author (populated from JWT token on the backend)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  author: { type: String, default: 'Anonymous' },
  authorInit: { type: String, default: 'A' },
  college: { type: String, default: '' },

  // Core info
  company: { type: String, required: true },
  role: { type: String, required: true },
  ctc: { type: String, default: '' },
  verdict: { type: String, enum: ['selected', 'rejected', 'intern'], default: 'selected' },
  type: { type: String, enum: ['placement', 'internship'], default: 'placement' },
  campus: { type: String, enum: ['oncampus', 'offcampus'], default: 'oncampus' },
  diff: { type: String, enum: ['easy', 'med', 'hard'], default: 'med' },

  // Content
  rounds: { type: [RoundSchema], default: [] },
  advice: { type: String, default: '' },

  // Engagement
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters: { type: Map, of: String, default: {} }, // userId -> 'up'|'down'
  bookmarks: { type: [String], default: [] }, // array of userIds
  comments: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
