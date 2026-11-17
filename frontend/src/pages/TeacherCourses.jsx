import { useEffect, useState } from "react";
import api from "../services/api";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    thumbnail: ""
  });

  const [editingId, setEditingId] = useState(null);

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses/teacher/my-courses");
      setCourses(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể tải khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      price: 0,
      thumbnail: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
        setMessage("Cập nhật khóa học thành công");
      } else {
        await api.post("/courses", form);
        setMessage("Tạo khóa học thành công");
      }

      resetForm();
      loadCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể lưu khóa học");
    }
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      price: course.price || 0,
      thumbnail: course.thumbnail || ""
    });

    setEditingId(course._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;

    try {
      await api.delete(`/courses/${id}`);
      setMessage("Đã xóa khóa học");
      loadCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể xóa khóa học");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="page-container">
      <h1>Quản lý khóa học</h1>
      <p>Tạo và quản lý các khóa học do bạn phụ trách.</p>

      {message && <div className="notice">{message}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{editingId ? "Cập nhật khóa học" : "Tạo khóa học mới"}</h2>

        <label>Tên khóa học</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Mô tả</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />

        <label>Danh mục</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <label>Học phí</label>
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
        />

        <label>Ảnh đại diện (URL)</label>
        <input
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button type="submit">
            {editingId ? "Lưu thay đổi" : "Tạo khóa học"}
          </button>

          {editingId && (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <h2>Danh sách khóa học của tôi</h2>

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course._id}>
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} />
            )}

            <div className="course-card-body">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Danh mục: {course.category}</p>
              <p>Học phí: {Number(course.price || 0).toLocaleString("vi-VN")} VNĐ</p>

              <div className="form-actions">
                <button onClick={() => handleEdit(course)}>Sửa</button>
                <button
                  className="danger-button"
                  onClick={() => handleDelete(course._id)}
                >
                  Xóa
                </button>
                <a href={`/teacher/courses/${course._id}/manage`}>
                  Quản lý lớp
                </a>
              </div>
            </div>
          </article>
        ))}

        {courses.length === 0 && <p>Bạn chưa tạo khóa học nào.</p>}
      </div>
    </div>
  );
}

export default TeacherCourses;