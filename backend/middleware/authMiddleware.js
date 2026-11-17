const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user || !req.user.isActive) {
        return res.status(403).json({ message: 'Tài khoản không tồn tại hoặc đã bị khóa' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ' });
    }
  } else {
    res.status(401).json({ message: 'Không có quyền truy cập, thiếu Token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Vai trò (${req.user.role}) không được phép thực hiện thao tác này` });
    }
    next();
  };
};

module.exports = { protect, authorize };