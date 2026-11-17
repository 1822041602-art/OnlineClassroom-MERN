import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="hero">
      <h1>404 - Không tìm thấy trang</h1>
      <Link to="/" className="btn btn-primary">Quay về trang chủ</Link>
    </div>
  );
}