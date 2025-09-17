import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container">
      <h2>404 - Not Found</h2>
      <p>Trang bạn tìm không tồn tại.</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}
