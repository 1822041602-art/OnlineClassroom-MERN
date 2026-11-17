import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadAdminData = async () => {
    const [uRes, cRes] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/courses')
    ]);
    setUsers(uRes.data);
    setCourses(cRes.data);
  };

  useEffect(() => { loadAdminData(); }, []);

  const toggleUser = async (id) => {
    await api.put(`/admin/users/${id}/toggle`);
    loadAdminData();
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Xóa khóa học này khỏi hệ thống?')) {
      await api.delete(`/courses/${id}`);
      loadAdminData();
    }
  };

  return (
    <div>
      <h2>Quản trị Hệ thống (Admin)</h2>

      <div className="card">
        <h3>Quản lý Người dùng</h3>
        <table>
          <thead>
            <tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? '🟢 Hoạt động' : '🔴 Đã khóa'}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button onClick={() => toggleUser(u._id)} className="btn btn-outline">
                      {u.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Quản lý Toàn bộ Khóa học</h3>
        <table>
          <thead>
            <tr><th>Tên khóa học</th><th>Danh mục</th><th>Giảng viên</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.category}</td>
                <td>{c.teacher?.name}</td>
                <td><button onClick={() => deleteCourse(c._id)} className="btn btn-danger">Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}