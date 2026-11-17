import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user.role === 'student') {
        const { data } = await api.get('/enrollments/my');
        setStats(data);
      } else if (user.role === 'teacher') {
        const { data } = await api.get('/courses/teaching');
        setStats(data);
      } else if (user.role === 'admin') {
        const { data } = await api.get('/admin/users');
        setStats(data);
      }
    };
    fetchData();
  }, [user]);

  const avgProgress = user.role === 'student' && stats.length > 0
    ? Math.round(stats.reduce((acc, item) => acc + item.progress, 0) / stats.length)
    : 0;

  return (
    <div>
      <div className="welcome-banner">
        <div>
          <h2>Xin chào, {user.name} 👋</h2>
          <p>Chào mừng quay trở lại hệ thống học tập trực tuyến EduClass.</p>
        </div>
        <span className="role-pill">{user.role.toUpperCase()}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-box blue">
          <div className="stat-icon">📚</div>
          <div>
            <h3>{stats.length}</h3>
            <p>
              {user.role === 'student' && 'Khóa học đang theo học'}
              {user.role === 'teacher' && 'Khóa học đang giảng dạy'}
              {user.role === 'admin' && 'Tổng tài khoản hệ thống'}
            </p>
          </div>
        </div>

        {user.role === 'student' && (
          <div className="stat-box green">
            <div className="stat-icon">📈</div>
            <div>
              <h3>{avgProgress}%</h3>
              <p>Tiến độ hoàn thành trung bình</p>
            </div>
          </div>
        )}
      </div>

      {user.role === 'student' && (
        <div className="card">
          <h3>📊 Tiến độ học tập các khóa học</h3>
          {stats.length === 0 ? (
            <p className="text-muted">Bạn chưa ghi danh khóa học nào. <Link to="/courses">Khám phá ngay!</Link></p>
          ) : (
            stats.map((en) => (
              <div key={en._id} className="progress-row">
                <div className="progress-info">
                  <Link to={`/courses/${en.course?._id}`} className="course-link">{en.course?.title}</Link>
                  <span className="progress-percent">{en.progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${en.progress}%` }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}