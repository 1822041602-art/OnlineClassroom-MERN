import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🎓 EduClass MERN</Link>
      <div className="nav-links">
        <Link to="/courses">Khóa học</Link>
        {user ? (
          <>
            <span className="badge">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
            <Link to="/register" className="btn btn-primary">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}