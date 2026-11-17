import { useEffect, useState } from "react";
import api from "../services/api";

function TeacherAssignments() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: 10
  });

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses/teacher/my-courses");
      setCourses(response.data);

      if (response.data.length) {
        setCourseId(response.data[0]._id);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tải được khóa học");
    }
  };

  const loadAssignments = async (id) => {
    if (!id) return;

    try {
      const response = await api.get(`/assignments/course/${id}`);
      setAssignments(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tải được bài tập");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadAssignments(courseId);
  }, [courseId]);

  const createAssignment = async (event) => {
    event.preventDefault();

    try {
      await api.post("/assignments", {
        ...form,
        courseId,
        dueDate: form.dueDate || null
      });

      setForm({
        title: "",
        description: "",
        dueDate: "",
        maxScore: 10
      });

      setMessage("Tạo bài tập thành công");
      loadAssignments(courseId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tạo được bài tập");
    }
  };

  const showSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);

    try {
      const response = await api.get(
        `/assignments/${assignment._id}/submissions`
      );
      setSubmissions(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tải được bài nộp");
    }
  };

  const gradeSubmission = async (submissionId) => {
    const value = grades[submissionId];

    if (value === undefined || value === "") {
      setMessage("Vui lòng nhập điểm");
      return;
    }

    try {
      await api.put(`/assignments/submissions/${submissionId}/grade`, {
        grade: Number(value),
        feedback: ""
      });

      setMessage("Chấm điểm thành công");
      if (selectedAssignment) showSubmissions(selectedAssignment);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không chấm được điểm");
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài tập?")) return;

    try {
      await api.delete(`/assignments/${id}`);
      setMessage("Đã xóa bài tập");
      loadAssignments(courseId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không xóa được bài tập");
    }
  };

  return (
    <div className="page-container">
      <h1>Quản lý bài tập</h1>
      {message && <div className="notice">{message}</div>}

      <section className="form-card">
        <h2>Chọn khóa học</h2>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </section>

      <section className="form-card">
        <h2>Tạo bài tập mới</h2>

        <form onSubmit={createAssignment}>
          <label>Tên bài tập</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label>Mô tả yêu cầu</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <label>Hạn nộp</label>
          <input
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <label>Điểm tối đa</label>
          <input
            type="number"
            min="1"
            value={form.maxScore}
            onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
          />

          <button type="submit" disabled={!courseId}>Tạo bài tập</button>
        </form>
      </section>

      <section className="form-card">
        <h2>Danh sách bài tập</h2>

        {assignments.map((assignment) => (
          <div className="assignment-row" key={assignment._id}>
            <div>
              <strong>{assignment.title}</strong>
              <p>{assignment.description}</p>
              <p>Điểm tối đa: {assignment.maxScore}</p>
            </div>

            <div className="form-actions">
              <button onClick={() => showSubmissions(assignment)}>
                Xem bài nộp
              </button>
              <button
                className="danger-button"
                onClick={() => deleteAssignment(assignment._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}

        {!assignments.length && <p>Chưa có bài tập.</p>}
      </section>

      {selectedAssignment && (
        <section className="form-card">
          <h2>Bài nộp: {selectedAssignment.title}</h2>

          {submissions.map((submission) => (
            <div className="submission-card" key={submission._id}>
              <strong>{submission.student?.name}</strong>
              <p>{submission.student?.email}</p>
              <p>{submission.content}</p>

              {submission.fileUrl && (
                <a
                  href={`http://localhost:5000${submission.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Xem file bài nộp
                </a>
              )}

              <p>
                Điểm hiện tại:{" "}
                {submission.grade === null ? "Chưa chấm" : submission.grade}
              </p>

              <div className="grade-controls">
                <input
                  type="number"
                  min="0"
                  max={selectedAssignment.maxScore}
                  placeholder={`Điểm / ${selectedAssignment.maxScore}`}
                  value={grades[submission._id] ?? ""}
                  onChange={(e) =>
                    setGrades({
                      ...grades,
                      [submission._id]: e.target.value
                    })
                  }
                />
                <button onClick={() => gradeSubmission(submission._id)}>
                  Lưu điểm
                </button>
              </div>
            </div>
          ))}

          {!submissions.length && <p>Chưa có sinh viên nộp bài.</p>}
        </section>
      )}
    </div>
  );
}

export default TeacherAssignments;