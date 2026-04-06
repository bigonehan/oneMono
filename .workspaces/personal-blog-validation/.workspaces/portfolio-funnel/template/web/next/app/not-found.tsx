import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>Page Not Found</h1>
      <p>요청한 경로를 찾을 수 없습니다.</p>
      <Link href="/">Go to Main</Link>
    </div>
  );
}
