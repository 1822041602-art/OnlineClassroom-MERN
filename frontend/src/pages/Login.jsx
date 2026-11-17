import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Cột trái: Banner giới thiệu */}
        <div className="auth-side-banner">
          <div className="auth-banner-content">
            <span className="auth-pill">🎓 EduClass MERN</span>
            <h2>Chào mừng bạn quay trở lại!</h2>
            <p>
              Tiếp tục hành trình chinh phục tri thức, quản lý lớp học và theo dõi tiến độ học tập của bạn ngay hôm nay.
            </p>
            <ul className="auth-highlights">
              <li>✓ Truy cập bài giảng PDF & Video mọi lúc</li>
              <li>✓ Nộp bài tập và nhận điểm số trực tuyến</li>
              <li>✓ Hệ thống bảo mật phân quyền JWT</li>
            </ul>
          </div>
        </div>

        {/* Cột phải: Form đăng nhập */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h2>Đăng nhập</h2>
            <p>Nhập thông tin tài khoản của bạn để tiếp tục</p>
          </div>

          {error && <div className="alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Địa chỉ Email</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập vào hệ thống →'}
            </button>
          </form>

          <div className="auth-footer-text">
            Chưa có tài khoản? <Link to="/register">Đăng ký miễn phí ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}