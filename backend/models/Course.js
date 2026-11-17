const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video', 'article'], required: true },
  contentUrl: { type: String }, // Link video hoặc đường dẫn file PDF
  textContent: { type: String }, // Nội dung bài đọc
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materials: [materialSchema],
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);