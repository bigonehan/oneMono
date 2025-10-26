export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          페이지를 찾을 수 없어요.
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
      </div>
    </div>
  );
}
