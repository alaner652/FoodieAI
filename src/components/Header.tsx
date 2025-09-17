"use client";

import Container from "@/components/ui/Container";
import { NAV_CONFIG } from "@/constants/navigation";
import { APP_CONFIG } from "@/lib/config";
import { LogInIcon, Menu, Settings, Sparkles, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export default function Header({
  title = APP_CONFIG.NAME,
  showNav = false,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isSignInPage = pathname === "/sign-in";
  const isSignUpPage = pathname === "/sign-up";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <Container maxWidth="7xl" className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500 -mt-1">智能餐廳推薦</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <SignedIn>
              {showNav && NAV_CONFIG.NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="flex items-center space-x-2">
                {!isSignInPage && (
                  <Link
                    href="/sign-in"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <LogInIcon className="w-4 h-4" />
                    <span>登入</span>
                  </Link>
                )}
                {!isSignUpPage && (
                  <Link
                    href="/sign-up"
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>註冊</span>
                  </Link>
                )}
              </div>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <SignedIn>
            {showNav && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </SignedIn>

          <SignedOut>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </SignedOut>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t pt-2 pb-3 space-y-1">
            <SignedIn>
              {showNav && NAV_CONFIG.NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center space-x-3 px-3 py-3 text-gray-700 hover:text-orange-600 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <div className="border-t pt-3 mt-3 px-3 py-3">
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="space-y-2">
                {!isSignInPage && (
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center space-x-3 w-full px-3 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg font-medium transition-colors"
                  >
                    <LogInIcon className="w-5 h-5" />
                    <span>登入</span>
                  </Link>
                )}
                {!isSignUpPage && (
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center space-x-3 w-full px-3 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>註冊</span>
                  </Link>
                )}
              </div>
            </SignedOut>
          </div>
        )}
      </Container>
    </header>
  );
}
