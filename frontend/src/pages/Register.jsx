import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Cột trái: Banner giới thiệu */}
        <div className="auth-side-banner register-theme">
          <div className="auth-banner-content">
            <span className="auth-pill">🚀 Tham gia cùng chúng tôi</span>
            <h2>Khởi tạo không gian học tập số của riêng bạn</h2>
            <p>
              Dù bạn là Giảng viên muốn xây dựng khóa học hay Sinh viên đang tìm kiếm tri thức, EduClass luôn sẵn sàng đồng hành.
            </p>
            <div className="auth-stats-mini">
              <div>
                <strong>100%</strong>
                <span>Trực tuyến</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Truy cập tài liệu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Form đăng ký */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h2>Tạo tài khoản mới</h2>
            <p>Điền thông tin bên dưới để bắt đầu sử dụng</p>
          </div>

          {error && <div className="alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Chọn vai trò tham gia</label>
              <div className="role-selector">
                <div
                  className={`role-option ${form.role === 'student' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: 'student' })}
                >
                  <span className="role-emoji">🎒</span>
                  <div>
                    <strong>Sinh viên</strong>
                    <small>Ghi danh & học tập</small>
                  </div>
                </div>

                <div
                  className={`role-option ${form.role === 'teacher' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: 'teacher' })}
                >
                  <span className="role-emoji">👨‍🏫</span>
                  <div>
                    <strong>Giảng viên</strong>
                    <small>Tạo lớp & giảng dạy</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Họ và tên</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ Email</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký →'}
            </button>
          </form>

          <div className="auth-footer-text">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}