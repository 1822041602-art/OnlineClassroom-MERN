const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createAssignment, getAssignmentsByCourse, submitAssignment,
  getSubmissionsByAssignment, getMySubmission, gradeSubmission
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/', protect, authorize('teacher'), createAssignment);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.post('/submit', protect, authorize('student'), upload.single('file'), submitAssignment);
router.get('/:assignmentId/submissions', protect, authorize('teacher'), getSubmissionsByAssignment);
router.get('/:assignmentId/my-submission', protect, authorize('student'), getMySubmission);
router.put('/grade/:submissionId', protect, authorize('teacher'), gradeSubmission);

module.exports = router;