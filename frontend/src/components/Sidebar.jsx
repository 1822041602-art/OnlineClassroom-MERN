import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard">📊 Bảng điều khiển</NavLink>
      <NavLink to="/courses">📚 Khám phá khóa học</NavLink>
      {user.role === 'student' && (
        <>
          <NavLink to="/my-courses">🎒 Khóa học của tôi</NavLink>
          <NavLink to="/assignments">📝 Bài tập của tôi</NavLink>
        </>
      )}
      {user.role === 'teacher' && (
        <>
          <NavLink to="/my-courses">🏫 Lớp học giảng dạy</NavLink>
          <NavLink to="/assignments">📋 Quản lý bài tập</NavLink>
        </>
      )}
      {user.role === 'admin' && (
        <NavLink to="/admin/users">🛡️ Quản trị hệ thống</NavLink>
      )}
    </aside>
  );
}