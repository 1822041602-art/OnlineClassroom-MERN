const Course = require('../models/Course');

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('teacher', 'name email');
    res.json(courses);
  } catch (error) { next(error); }
};

exports.getMyTeachingCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });
    res.json(courses);
  } catch (error) { next(error); }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email');
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    res.json(course);
  } catch (error) { next(error); }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const course = await Course.create({ title, description, category, teacher: req.user._id });
    res.status(201).json(course);
  } catch (error) { next(error); }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa khóa học này' });
    }
    Object.assign(course, req.body);
    const updated = await course.save();
    res.json(updated);
  } catch (error) { next(error); }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa khóa học này' });
    }
    await course.deleteOne();
    res.json({ message: 'Đã xóa khóa học' });
  } catch (error) { next(error); }
};

exports.addMaterial = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền thêm tài liệu' });
    }
    const { title, type, contentUrl, textContent } = req.body;
    const finalUrl = req.file ? `/uploads/${req.file.filename}` : contentUrl;

    course.materials.push({ title, type, contentUrl: finalUrl, textContent });
    await course.save();
    res.status(201).json(course);
  } catch (error) { next(error); }
};