import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>🎓 EduClass MERN</h3>
          <p>
            Nền tảng Quản lý Lớp học Trực tuyến hiện đại. Hỗ trợ giảng viên số hóa bài giảng, 
            giao bài tập và giúp sinh viên theo dõi tiến độ học tập mọi lúc, mọi nơi.
          </p>
        </div>

        <div className="footer-col">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/courses">Danh sách khóa học</Link></li>
            <li><Link to="/dashboard">Bảng điều khiển</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Công nghệ sử dụng</h4>
          <ul>
            <li>MongoDB & Mongoose</li>
            <li>Express.js & Node.js</li>
            <li>React.js & Vite</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Thông tin đồ án</h4>
          <p>Đề tài: Hệ thống Lớp học Trực tuyến</p>
          <p>Môn học: Lập trình Web (MERN Stack)</p>
          <p>Hỗ trợ: support@educlass.vn</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EduClass MERN. Đồ án Tiểu luận Cuối kỳ - Phát triển bởi Sinh viên.</p>
      </div>
    </footer>
  );
}