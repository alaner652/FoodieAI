"use client";

import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";
import { LogInIcon, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserButton from "./CustomUserButton";
import CustomUserProfile from "./CustomUserProfile";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = APP_CONFIG.NAME }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const isSignInPage = pathname === "/sign-in";
  const isSignUpPage = pathname === "/sign-up";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 scroll-smooth">
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
              <CustomUserButton
                onSettingsClick={() => setIsProfileOpen(true)}
              />
            </SignedIn>

            <SignedOut>
              {!isSignInPage && !isSignUpPage && (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/sign-in"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <LogInIcon className="w-4 h-4" />
                    <span>登入</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>註冊</span>
                  </Link>
                </div>
              )}
            </SignedOut>
          </div>

          {/* Mobile User Button */}
          <div className="md:hidden">
            <SignedIn>
              <CustomUserButton
                onSettingsClick={() => setIsProfileOpen(true)}
              />
            </SignedIn>

            <SignedOut>
              {!isSignInPage && !isSignUpPage && (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/sign-in"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <LogInIcon className="w-4 h-4" />
                    <span>登入</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>註冊</span>
                  </Link>
                </div>
              )}
            </SignedOut>
          </div>
        </div>
      </Container>

      {/* Custom User Profile Modal */}
      <CustomUserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </header>
  );
}
