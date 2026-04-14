const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true, index: true }, // e.g. "google-general"
  userId: { type: String, default: 'anon' },
  username: { type: String, default: 'Anonymous' },
  userInit: { type: String, default: 'A' },
  role: { type: String, default: 'student' }, // student | senior
  text: { type: String, required: true, maxlength: 2000 },
  type: { type: String, enum: ['text', 'system'], default: 'text' },
}, { timestamps: true, versionKey: false });

// Index for fast room lookup sorted by time
MessageSchema.index({ room: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
