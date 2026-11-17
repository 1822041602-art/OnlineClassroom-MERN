const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, getAllCoursesAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/courses', getAllCoursesAdmin);

module.exports = router;