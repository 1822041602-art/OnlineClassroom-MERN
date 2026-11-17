import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="home-container">
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">🚀 Nền tảng học tập thế hệ mới</span>
          <h1>Nâng tầm trải nghiệm học tập & giảng dạy trực tuyến</h1>
          <p>
            Kết nối Giảng viên và Sinh viên trên một hệ thống duy nhất. Quản lý bài giảng đa phương tiện, 
            nộp bài tập trực tuyến và theo dõi tiến độ học tập theo thời gian thực.
          </p>
          <div className="hero-actions">
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-light btn-lg">
              {user ? 'Vào Bảng điều khiển →' : 'Đăng ký miễn phí →'}
            </Link>
            <Link to="/courses" className="btn btn-outline-light btn-lg">
              Khám phá khóa học
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Tính năng nổi bật của hệ thống</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Dành cho Giảng viên</h3>
            <p>Khởi tạo lớp học nhanh chóng, tải lên tài liệu PDF, Video bài giảng, giao bài tập và chấm điểm trực tiếp.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Dành cho Sinh viên</h3>
            <p>Ghi danh dễ dàng, theo dõi thanh tiến độ hoàn thành bài học, nộp bài tập trực tuyến và xem điểm tức thì.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Quản trị tập trung</h3>
            <p>Hệ thống phân quyền chặt chẽ (RBAC) với JWT giúp kiểm soát người dùng và chất lượng khóa học toàn diện.</p>
          </div>
        </div>
      </section>
    </div>
  );
}