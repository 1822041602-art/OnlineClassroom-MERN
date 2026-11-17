const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  textSubmission: { type: String },
  fileUrl: { type: String },
  score: { type: Number, default: null },
  feedback: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);