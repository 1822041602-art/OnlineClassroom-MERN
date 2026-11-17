const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getCourses, getMyTeachingCourses, getCourseById,
  createCourse, updateCourse, deleteCourse, addMaterial
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/', getCourses);
router.get('/teaching', protect, authorize('teacher'), getMyTeachingCourses);
router.get('/:id', protect, getCourseById);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.post('/:id/materials', protect, authorize('teacher'), upload.single('file'), addMaterial);

module.exports = router;