import { useEffect, useState } from 'react';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Assignments() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [newAssign, setNewAssign] = useState({ title: '', description: '', dueDate: '' });

  // Dành cho Student nộp bài & Teacher chấm bài
  const [subText, setSubText] = useState('');
  const [subFile, setSubFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeAssignId, setActiveAssignId] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      if (user.role === 'teacher') {
        const { data } = await api.get('/courses/teaching');
        setCourses(data);
        if (data[0]) setSelectedCourse(data[0]._id);
      } else {
        const { data } = await api.get('/enrollments/my');
        const list = data.map((e) => e.course).filter(Boolean);
        setCourses(list);
        if (list[0]) setSelectedCourse(list[0]._id);
      }
    };
    loadCourses();
  }, [user]);

  const loadAssignments = async () => {
    if (!selectedCourse) return;
    const { data } = await api.get(`/assignments/course/${selectedCourse}`);
    setAssignments(data);
  };

  useEffect(() => { loadAssignments(); }, [selectedCourse]);

  const handleCreateAssign = async (e) => {
    e.preventDefault();
    await api.post('/assignments', { ...newAssign, course: selectedCourse });
    setNewAssign({ title: '', description: '', dueDate: '' });
    loadAssignments();
  };

  const handleStudentSubmit = async (assignmentId) => {
    const fd = new FormData();
    fd.append('assignmentId', assignmentId);
    fd.append('textSubmission', subText);
    if (subFile) fd.append('file', subFile);
    await api.post('/assignments/submit', fd);
    alert('Nộp bài thành công!');
    setSubText('');
    setSubFile(null);
  };

  const viewSubmissions = async (assignmentId) => {
    setActiveAssignId(assignmentId);
    if (user.role === 'teacher') {
      const { data } = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(data);
    } else {
      const { data } = await api.get(`/assignments/${assignmentId}/my-submission`);
      setSubmissions(data ? [data] : []);
    }
  };

  const handleGrade = async (submissionId, score, feedback) => {
    await api.put(`/assignments/grade/${submissionId}`, { score, feedback });
    alert('Đã lưu điểm!');
    viewSubmissions(activeAssignId);
  };

  return (
    <div>
      <h2>Quản lý Bài tập (Assignments)</h2>
      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="select-course">
        {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>

      {user.role === 'teacher' && selectedCourse && (
        <form onSubmit={handleCreateAssign} className="card">
          <h3>Giao bài tập mới</h3>
          <input placeholder="Tiêu đề bài tập" value={newAssign.title} onChange={(e) => setNewAssign({ ...newAssign, title: e.target.value })} required />
          <textarea placeholder="Yêu cầu chi tiết" value={newAssign.description} onChange={(e) => setNewAssign({ ...newAssign, description: e.target.value })} required />
          <input type="date" value={newAssign.dueDate} onChange={(e) => setNewAssign({ ...newAssign, dueDate: e.target.value })} required />
          <button type="submit" className="btn btn-primary">Tạo bài tập</button>
        </form>
      )}

      {assignments.map((a) => (
        <div key={a._id} className="card">
          <h3>{a.title}</h3>
          <p>{a.description}</p>
          <small>Hạn nộp: {new Date(a.dueDate).toLocaleDateString('vi-VN')}</small>

          {user.role === 'student' && (
            <div className="submit-box">
              <textarea placeholder="Nhập câu trả lời trực tiếp..." onChange={(e) => setSubText(e.target.value)} />
              <input type="file" onChange={(e) => setSubFile(e.target.files[0])} />
              <button onClick={() => handleStudentSubmit(a._id)} className="btn btn-primary">Nộp bài</button>
            </div>
          )}

          <button onClick={() => viewSubmissions(a._id)} className="btn btn-outline" style={{ marginTop: '10px' }}>
            {user.role === 'teacher' ? 'Xem bài nộp & Chấm điểm' : 'Xem bài đã nộp & Điểm số'}
          </button>

          {activeAssignId === a._id && (
            <div className="submission-list">
              {submissions.length === 0 && <p>Chưa có dữ liệu bài nộp.</p>}
              {submissions.map((s) => (
                <div key={s._id} className="sub-item">
                  {s.student && <strong>Sinh viên: {s.student.name}</strong>}
                  <p>Nội dung: {s.textSubmission || 'Không có'}</p>
                  {s.fileUrl && <a href={`${BACKEND_URL}${s.fileUrl}`} target="_blank" rel="noreferrer">📎 Tệp đính kèm</a>}
                  <p>Điểm số: <strong>{s.score !== null ? `${s.score}/100` : 'Chưa chấm'}</strong> | Nhận xét: {s.feedback}</p>

                  {user.role === 'teacher' && (
                    <div className="grade-box">
                      <input type="number" placeholder="Điểm (0-100)" id={`score-${s._id}`} defaultValue={s.score} />
                      <input type="text" placeholder="Nhận xét" id={`fb-${s._id}`} defaultValue={s.feedback} />
                      <button
                        onClick={() => handleGrade(
                          s._id,
                          document.getElementById(`score-${s._id}`).value,
                          document.getElementById(`fb-${s._id}`).value
                        )}
                        className="btn btn-primary"
                      >
                        Lưu điểm
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}