const express = require('express');
const router = express.Router();
const {
  enrollCourse, getMyEnrollments, getCourseStudents, updateProgress
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), enrollCourse);
router.get('/my', protect, authorize('student'), getMyEnrollments);
router.get('/course/:courseId', protect, authorize('teacher', 'admin'), getCourseStudents);
router.put('/progress', protect, authorize('student'), updateProgress);

module.exports = router;