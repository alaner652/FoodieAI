import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          頁面未找到
        </h2>
        <p className="text-gray-500 mb-8">抱歉，您要尋找的頁面不存在。</p>
        <Link href="/">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            返回首頁
          </Button>
        </Link>
      </div>
    </div>
  );
}
