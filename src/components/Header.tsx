"use client";

import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";
import { Menu, Settings, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export default function Header({
  title = APP_CONFIG.NAME,
  showNav = false,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <Container maxWidth="7xl" className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和標題 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 -mt-1">智能餐廳推薦</p>
              </div>
            </Link>
          </div>

          {/* 桌面版導航 */}
          {showNav && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/test"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-all duration-200 rounded-lg hover:bg-orange-50 group"
              >
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium text-sm">設定</span>
              </Link>
            </nav>
          )}

          {/* 手機版選單按鈕 */}
          {showNav && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* 手機版導航選單 */}
        {showNav && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/test"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-orange-600 transition-all duration-200 rounded-lg hover:bg-orange-50 group"
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">設定</span>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
