const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng' });

    // Không cho phép tự đăng ký quyền admin qua API công khai
    const safeRole = role === 'teacher' ? 'teacher' : 'student';
    const user = await User.create({ name, email, password, role: safeRole });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};