import { Sparkles } from "lucide-react";

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export default function Header({
  title = "FoodieAI",
  showNav = false,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              {title}
            </h1>
          </div>

          {showNav && (
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                首頁
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                歷史記錄
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                收藏夾
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
