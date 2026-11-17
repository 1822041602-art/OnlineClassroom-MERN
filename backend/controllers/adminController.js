const User = require('../models/User');
const Course = require('../models/Course');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) { next(error); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `Đã ${user.isActive ? 'mở khóa' : 'khóa'} tài khoản`, user });
  } catch (error) { next(error); }
};

exports.getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    res.json(courses);
  } catch (error) { next(error); }
};