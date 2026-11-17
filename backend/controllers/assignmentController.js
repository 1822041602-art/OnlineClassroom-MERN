const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

exports.createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) { next(error); }
};

exports.getAssignmentsByCourse = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (error) { next(error); }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, textSubmission } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    let submission = await Submission.findOne({ assignment: assignmentId, student: req.user._id });
    if (submission) {
      submission.textSubmission = textSubmission || submission.textSubmission;
      if (fileUrl) submission.fileUrl = fileUrl;
      await submission.save();
    } else {
      submission = await Submission.create({
        assignment: assignmentId,
        student: req.user._id,
        textSubmission,
        fileUrl
      });
    }
    res.status(201).json(submission);
  } catch (error) { next(error); }
};

exports.getSubmissionsByAssignment = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name email');
    res.json(submissions);
  } catch (error) { next(error); }
};

exports.getMySubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user._id
    });
    res.json(submission);
  } catch (error) { next(error); }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { score, feedback },
      { new: true }
    );
    res.json(submission);
  } catch (error) { next(error); }
};