"use client";

import Container from "@/components/ui/Container";
import { NAV_CONFIG } from "@/constants/navigation";
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <Container maxWidth="7xl" className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <p className="text-xs text-gray-500 -mt-1">智能餐廳推薦</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {showNav && (
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_CONFIG.NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 rounded-lg hover:bg-orange-50"
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {showNav && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {showNav && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_CONFIG.NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 rounded-lg hover:bg-orange-50"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
