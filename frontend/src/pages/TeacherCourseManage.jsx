import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function TeacherCourseManage() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  const [material, setMaterial] = useState({
    title: "",
    type: "video",
    url: "",
    description: ""
  });

  const [file, setFile] = useState(null);

  const loadData = async () => {
    try {
      const [courseRes, studentRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/courses/${id}/students`)
      ]);

      setCourse(courseRes.data);
      setStudents(studentRes.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tải được dữ liệu");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const addMaterial = async (event) => {
    event.preventDefault();

    try {
      await api.post(`/courses/${id}/materials`, material);
      setMaterial({
        title: "",
        type: "video",
        url: "",
        description: ""
      });
      setMessage("Đã thêm tài liệu");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể thêm tài liệu");
    }
  };

  const uploadPDF = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Vui lòng chọn file");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("title", file.name);

    try {
      await api.post(`/courses/${id}/materials/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setFile(null);
      setMessage("Tải tài liệu thành công");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể tải file");
    }
  };

  const deleteMaterial = async (materialId) => {
    if (!window.confirm("Xóa tài liệu này?")) return;

    try {
      await api.delete(`/courses/${id}/materials/${materialId}`);
      setMessage("Đã xóa tài liệu");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể xóa tài liệu");
    }
  };

  if (!course) {
    return <div className="page-container">{message || "Đang tải..."}</div>;
  }

  return (
    <div className="page-container">
      <h1>Quản lý lớp học</h1>
      <h2>{course.title}</h2>

      {message && <div className="notice">{message}</div>}

      <section className="form-card">
        <h2>Thêm video hoặc bài đọc</h2>

        <form onSubmit={addMaterial}>
          <label>Tên tài liệu</label>
          <input
            value={material.title}
            onChange={(e) => setMaterial({ ...material, title: e.target.value })}
            required
          />

          <label>Loại tài liệu</label>
          <select
            value={material.type}
            onChange={(e) => setMaterial({ ...material, type: e.target.value })}
          >
            <option value="video">Video</option>
            <option value="reading">Bài đọc</option>
          </select>

          <label>Đường dẫn</label>
          <input
            value={material.url}
            onChange={(e) => setMaterial({ ...material, url: e.target.value })}
            placeholder="https://..."
            required
          />

          <label>Mô tả</label>
          <textarea
            value={material.description}
            onChange={(e) => setMaterial({ ...material, description: e.target.value })}
          />

          <button type="submit">Thêm tài liệu</button>
        </form>
      </section>

      <section className="form-card">
        <h2>Upload tài liệu PDF</h2>

        <form onSubmit={uploadPDF}>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Tải lên</button>
        </form>
      </section>

      <section className="form-card">
        <h2>Tài liệu khóa học</h2>

        {course.materials?.length ? (
          course.materials.map((item) => (
            <div className="material-row" key={item._id}>
              <div>
                <strong>{item.title}</strong>
                <p>Loại: {item.type}</p>
                <a
                  href={
                    item.url.startsWith("http")
                      ? item.url
                      : `http://localhost:5000${item.url}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Mở tài liệu
                </a>
              </div>

              <button
                className="danger-button"
                onClick={() => deleteMaterial(item._id)}
              >
                Xóa
              </button>
            </div>
          ))
        ) : (
          <p>Chưa có tài liệu.</p>
        )}
      </section>

      <section className="form-card">
        <h2>Danh sách sinh viên ghi danh ({students.length})</h2>

        {students.map((item) => (
          <div className="student-row" key={item._id}>
            <strong>{item.student?.name || "Sinh viên"}</strong>
            <span>{item.student?.email}</span>
          </div>
        ))}

        {students.length === 0 && <p>Chưa có sinh viên ghi danh.</p>}
      </section>
    </div>
  );
}

export default TeacherCourseManage;