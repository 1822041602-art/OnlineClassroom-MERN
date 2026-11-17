const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const exists = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (exists) return res.status(400).json({ message: 'Bạn đã ghi danh khóa học này rồi' });

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    res.status(201).json(enrollment);
  } catch (error) { next(error); }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'teacher', select: 'name' } });
    res.json(enrollments);
  } catch (error) { next(error); }
};

exports.getCourseStudents = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email');
    res.json(enrollments);
  } catch (error) { next(error); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { courseId, materialId } = req.body;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    const course = await Course.findById(courseId);
    if (!enrollment || !course) return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });

    if (!enrollment.completedMaterials.includes(materialId)) {
      enrollment.completedMaterials.push(materialId);
    }
    const total = course.materials.length;
    enrollment.progress = total > 0 ? Math.round((enrollment.completedMaterials.length / total) * 100) : 100;
    await enrollment.save();
    res.json(enrollment);
  } catch (error) { next(error); }
};