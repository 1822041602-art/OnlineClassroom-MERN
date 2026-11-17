# 🎓 Hệ thống Lớp học Trực tuyến (Online Classroom - MERN Stack)

## 📌 Mô tả dự án
Dự án Tiểu luận Cuối kỳ môn Lập trình Web xây dựng nền tảng quản lý lớp học trực tuyến (LMS) sử dụng kiến trúc **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Hệ thống hỗ trợ phân quyền 3 vai trò (**Admin**, **Teacher**, **Student**) với các chức năng chính:
- **Xác thực & Phân quyền:** Đăng ký, đăng nhập bảo mật bằng JWT và mã hóa mật khẩu Bcrypt.
- **Giảng viên (Teacher):** Tạo/Sửa/Xóa khóa học (CRUD), đăng tải tài liệu (PDF, Video link, Bài đọc), tạo bài tập và chấm điểm bài nộp của sinh viên.
- **Sinh viên (Student):** Tìm kiếm, ghi danh khóa học, xem bài giảng, theo dõi phần trăm tiến độ học tập, nộp bài tập (text/file) và xem điểm.
- **Quản trị viên (Admin):** Quản lý danh sách người dùng (Khóa/Mở khóa tài khoản) và quản lý toàn bộ khóa học trên hệ thống.

## 🛠️ Công nghệ sử dụng
- **Frontend:** React.js (Vite), React Router DOM, Context API, Axios
- **Backend:** Node.js, Express.js, JWT, Bcryptjs, Multer
- **Database:** MongoDB & Mongoose

## 🚀 Hướng dẫn cài đặt và khởi chạy

### 1. Clone dự án
```bash
git clone [https://github.com/1822041602-art/OnlineClassroom-MERN.git](https://github.com/1822041602-art/OnlineClassroom-MERN.git)
cd OnlineClassroom-MERN
