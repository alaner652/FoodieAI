"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CustomUserButtonProps {
  onSettingsClick: () => void;
}

export default function CustomUserButton({
  onSettingsClick,
}: CustomUserButtonProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Image
          src={user.imageUrl}
          alt={user.fullName || user.username || "User"}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <ChevronDown
          className={`w-3 h-3 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {/* 應用設定 */}
            <button
              onClick={() => {
                onSettingsClick();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>應用設定</span>
            </button>

            {/* 管理帳戶 */}
            <button
              onClick={() => {
                openUserProfile();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>管理帳戶</span>
            </button>

            {/* 分隔線 */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* 登出 */}
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>登出</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
