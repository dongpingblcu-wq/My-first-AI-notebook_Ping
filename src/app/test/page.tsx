import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">测试页面</h1>
        <p className="text-gray-600">如果您看到这个页面，说明路由正常工作</p>
        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">返回首页</Link>
        </div>
      </div>
    </div>
  );
}