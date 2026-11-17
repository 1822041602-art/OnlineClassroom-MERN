import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyCourses() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'Lập trình' });
  const [editingId, setEditingId] = useState(null); // Lưu ID khóa học đang sửa

  const loadData = async () => {
    if (user.role === 'teacher') {
      const { data } = await api.get('/courses/teaching');
      setItems(data);
    } else {
      const { data } = await api.get('/enrollments/my');
      setItems(data);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Cập nhật khóa học (Update)
      await api.put(`/courses/${editingId}`, form);
      setEditingId(null);
    } else {
      // Tạo mới khóa học (Create)
      await api.post('/courses', form);
    }
    setForm({ title: '', description: '', category: 'Lập trình' });
    loadData();
  };

  const handleEditClick = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', category: 'Lập trình' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa khóa học này?')) {
      await api.delete(`/courses/${id}`);
      loadData();
    }
  };

  return (
    <div>
      <h2>{user.role === 'teacher' ? '🏫 Quản lý Lớp học của tôi' : '🎒 Khóa học đã ghi danh'}</h2>

      {user.role === 'teacher' && (
        <form onSubmit={handleSubmit} className="card">
          <h3>{editingId ? '✏️ Cập nhật thông tin khóa học' : '➕ Tạo khóa học mới'}</h3>
          <input
            placeholder="Tên khóa học"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Danh mục (VD: Lập trình, Thiết kế, Ngoại ngữ...)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <textarea
            placeholder="Mô tả khóa học"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Lưu thay đổi' : 'Tạo khóa học'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-outline">
                Hủy
              </button>
            )}
          </div>
        </form>
      )}

      <div className="course-grid">
        {user.role === 'teacher' ? items.map((c) => (
          <div key={c._id} className="card">
            <span className="course-tag" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{c.category}</span>
            <h3 style={{ marginTop: '10px' }}>{c.title}</h3>
            <p>{c.description}</p>
            <div className="card-actions">
              <Link to={`/courses/${c._id}`} className="btn btn-primary">Nội dung</Link>
              <button onClick={() => handleEditClick(c)} className="btn btn-outline">Sửa</button>
              <button onClick={() => handleDelete(c._id)} className="btn btn-danger">Xóa</button>
            </div>
          </div>
        )) : items.map((en) => (
          <div key={en._id} className="card">
            <h3>{en.course?.title}</h3>
            <p>Tiến độ hoàn thành: <strong>{en.progress}%</strong></p>
            <div className="progress-bar-bg" style={{ marginBottom: '14px' }}>
              <div className="progress-bar-fill" style={{ width: `${en.progress}%` }}></div>
            </div>
            <Link to={`/courses/${en.course?._id}`} className="btn btn-primary">Vào học</Link>
          </div>
        ))}
      </div>
    </div>
  );
}