import Header from "@/components/Header";
import { ToastProvider } from "@/contexts/ToastContext";
import { APP_CONFIG } from "@/lib/config";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { zhTW } from "@clerk/localizations";

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
  socialButtonsBlockButton: "使用 {{provider}} 繼續"
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
        cssLayerName: 'clerk',
      }}
    >
      <html lang="zh-TW">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider>
            <Header showNav={true} />
            {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
