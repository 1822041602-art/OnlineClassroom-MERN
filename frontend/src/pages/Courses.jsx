import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post('/enrollments', { courseId });
      alert('🎉 Ghi danh khóa học thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi ghi danh');
    }
  };

  const categories = ['All', ...new Set(courses.map((c) => c.category))];

  const filteredCourses = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>📚 Khám phá Khóa học</h2>
          <p className="text-muted">Chọn khóa học phù hợp để bắt đầu hành trình học tập của bạn</p>
        </div>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm khóa học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? 'Tất cả danh mục' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="card empty-state">Không tìm thấy khóa học nào phù hợp.</div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((c, idx) => (
            <div key={c._id} className="course-card">
              <div className={`course-cover cover-${(idx % 4) + 1}`}>
                <span className="course-tag">{c.category}</span>
              </div>
              <div className="course-body">
                <h3>{c.title}</h3>
                <p className="course-desc">{c.description}</p>
                <div className="course-meta">
                  <span>👨‍🏫 {c.teacher?.name || 'Giảng viên'}</span>
                  <span>📑 {c.materials?.length || 0} bài học</span>
                </div>
                <div className="card-actions">
                  <Link to={`/courses/${c._id}`} className="btn btn-outline flex-1">Xem chi tiết</Link>
                  {user?.role === 'student' && (
                    <button onClick={() => handleEnroll(c._id)} className="btn btn-primary flex-1">Ghi danh ngay</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}