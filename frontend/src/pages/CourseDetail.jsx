import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [matForm, setMatForm] = useState({ title: '', type: 'article', contentUrl: '', textContent: '' });
  const [file, setFile] = useState(null);

  const loadCourse = async () => {
    const { data } = await api.get(`/courses/${id}`);
    setCourse(data);
    if (user.role === 'teacher' || user.role === 'admin') {
      const resStu = await api.get(`/enrollments/course/${id}`);
      setStudents(resStu.data);
    }
  };

  useEffect(() => { loadCourse(); }, [id]);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', matForm.title);
    formData.append('type', matForm.type);
    formData.append('contentUrl', matForm.contentUrl);
    formData.append('textContent', matForm.textContent);
    if (file) formData.append('file', file);

    await api.post(`/courses/${id}/materials`, formData);
    setMatForm({ title: '', type: 'article', contentUrl: '', textContent: '' });
    setFile(null);
    loadCourse();
  };

  const markComplete = async (materialId) => {
    await api.put('/enrollments/progress', { courseId: id, materialId });
    alert('Đã cập nhật tiến độ học tập!');
  };

  if (!course) return <p>Đang tải...</p>;
  const isOwner = user.role === 'teacher' && course.teacher?._id === user._id;

  return (
    <div>
      <div className="card">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <small>Giảng viên: {course.teacher?.name}</small>
      </div>

      {isOwner && (
        <form onSubmit={handleAddMaterial} className="card">
          <h3>Đăng tải Tài liệu / Bài giảng</h3>
          <input placeholder="Tiêu đề bài học" value={matForm.title} onChange={(e) => setMatForm({ ...matForm, title: e.target.value })} required />
          <select value={matForm.type} onChange={(e) => setMatForm({ ...matForm, type: e.target.value })}>
            <option value="article">Bài đọc (Text)</option>
            <option value="video">Video Link (YouTube/URL)</option>
            <option value="pdf">Tài liệu PDF (Upload)</option>
          </select>
          {matForm.type === 'article' && (
            <textarea placeholder="Nội dung bài đọc..." value={matForm.textContent} onChange={(e) => setMatForm({ ...matForm, textContent: e.target.value })} />
          )}
          {matForm.type === 'video' && (
            <input placeholder="Dán đường dẫn Video..." value={matForm.contentUrl} onChange={(e) => setMatForm({ ...matForm, contentUrl: e.target.value })} />
          )}
          {matForm.type === 'pdf' && (
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
          )}
          <button type="submit" className="btn btn-primary">Thêm tài liệu</button>
        </form>
      )}

      <div className="card">
        <h3>Nội dung khóa học ({course.materials.length} bài)</h3>
        {course.materials.map((m) => (
          <div key={m._id} className="material-item">
            <h4>[{m.type.toUpperCase()}] {m.title}</h4>
            {m.type === 'article' && <p>{m.textContent}</p>}
            {m.type === 'video' && <a href={m.contentUrl} target="_blank" rel="noreferrer">▶ Xem Video bài giảng</a>}
            {m.type === 'pdf' && <a href={`${BACKEND_URL}${m.contentUrl}`} target="_blank" rel="noreferrer">📄 Tải xuống PDF</a>}
            {user.role === 'student' && (
              <button onClick={() => markComplete(m._id)} className="btn btn-outline">✓ Đánh dấu hoàn thành</button>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="card">
          <h3>Danh sách Sinh viên đã ghi danh ({students.length})</h3>
          <ul>
            {students.map((s) => (
              <li key={s._id}>{s.student?.name} ({s.student?.email}) — Tiến độ: {s.progress}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}