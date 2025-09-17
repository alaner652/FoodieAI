import Header from "@/components/Header";
import { ToastProvider } from "@/contexts/ToastContext";
import { APP_CONFIG } from "@/lib/config";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { zhTW } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

// 自定義中文本地化配置
const customZhTW = {
  ...zhTW,
  formFieldInputPlaceholder__emailAddress: "請輸入電子郵件地址",
  formFieldInputPlaceholder__password: "請輸入密碼",
  formFieldInputPlaceholder__confirmPassword: "請再次輸入密碼",
  formFieldInputPlaceholder__firstName: "請輸入名字",
  formFieldInputPlaceholder__lastName: "請輸入姓氏",
  formFieldInputPlaceholder__phoneNumber: "請輸入手機號碼",
  formButtonPrimary__signIn: "登入",
  formButtonPrimary__signUp: "註冊",
  dividerText: "或者",
  socialButtonsBlockButton: "使用 {{provider}} 繼續",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_CONFIG.NAME} - 智能餐廳推薦`,
  description: APP_CONFIG.DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        localization={customZhTW}
        appearance={{
          cssLayerName: "clerk",
          elements: {
            // 確保 CAPTCHA 和驗證元素有適當的樣式
            formFieldInput: "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200",
            formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors",
            card: "shadow-lg border border-gray-200 rounded-xl",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton: "border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-300",
            formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
            // CAPTCHA 相關樣式
            captcha: "rounded-lg border border-gray-300",
            formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
            // 確保驗證步驟的樣式
            formFieldAction: "text-orange-600 hover:text-orange-700 font-medium text-sm",
            identityPreviewText: "text-gray-600 text-sm",
            identityPreviewEditButton: "text-orange-600 hover:text-orange-700 font-medium text-sm",
          },
          variables: {
            colorPrimary: "#ea580c",
            colorSuccess: "#10b981",
            colorWarning: "#f59e0b",
            colorDanger: "#ef4444",
            borderRadius: "0.5rem",
          }
        }}
      >
      <html lang="zh-TW">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
