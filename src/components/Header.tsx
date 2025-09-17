"use client";

import Container from "@/components/ui/Container";
import { NAV_CONFIG } from "@/constants/navigation";
import { APP_CONFIG } from "@/lib/config";
import { LogInIcon, Menu, Settings, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export default function Header({
  title = APP_CONFIG.NAME,
  showNav = false,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

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

          {showNav && (
            <>
              {/* Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                {NAV_CONFIG.NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
                <SignedOut>
                  <SignInButton>
                    <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <LogInIcon className="w-4 h-4" />
                      <span>註冊</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>

              {/* Mobile */}
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
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {showNav && isOpen && (
          <div className="md:hidden border-t pt-2 pb-3 space-y-1">
            {NAV_CONFIG.NAVIGATION_ITEMS.map((item) => (
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

            <div className="border-t pt-3 mt-3">
              <SignedOut>
                <SignInButton>
                  <button className="flex justify-center space-x-3 w-full px-3 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                    <LogInIcon className="w-5 h-5" />
                    <span>註冊</span>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
            <SignedIn>
              <div className="px-3 py-3">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        )}
      </Container>
    </header>
  );
}
