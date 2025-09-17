"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";

interface AuthProps {
  action: "sign-in" | "sign-up";
}

export default function Auth({ action }: AuthProps) {
  const isSignIn = action === "sign-in";

  const config = {
    title: isSignIn ? "歡迎回來" : "建立帳戶",
    subtitle: isSignIn ? "登入您的 FoodieAI 帳戶" : "開始您的 FoodieAI 體驗",
    submitText: isSignIn ? "繼續" : "建立帳戶",
    bottomText: isSignIn ? "還沒有帳戶？" : "已經有帳戶？",
    bottomLink: {
      text: isSignIn ? "免費註冊" : "登入",
      href: isSignIn ? "/sign-up" : "/sign-in",
    },
    socialText: isSignIn ? "登入" : "註冊",
  };

  return (
    <>
      {isSignIn ? (
        <SignIn.Root>
          <SignIn.Step name="start">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 md:space-y-12">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {config.title}
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  {config.subtitle}
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <Clerk.Field
                  name="identifier"
                  className="space-y-3 sm:space-y-4"
                >
                  <Clerk.Label className="block text-base sm:text-lg font-medium text-gray-700">
                    電子郵件地址
                  </Clerk.Label>
                  <Clerk.Input
                    className="w-full px-4 sm:px-6 py-3 sm:py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-lg sm:text-xl placeholder-gray-400"
                    placeholder="請輸入您的電子郵件"
                  />
                  <Clerk.FieldError className="text-base text-red-500" />
                </Clerk.Field>

                <SignIn.Action
                  submit
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 sm:py-5 px-6 sm:px-8 rounded-lg transition-all duration-300 text-lg sm:text-xl"
                >
                  {config.submitText}
                </SignIn.Action>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-base sm:text-lg">
                    <span className="px-4 sm:px-6 bg-white text-gray-500">
                      或使用社交媒體
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Clerk.Connection
                    name="google"
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 sm:py-5 px-4 sm:px-8 rounded-lg transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google {config.socialText}
                  </Clerk.Connection>

                  <Clerk.Connection
                    name="github"
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 sm:py-5 px-4 sm:px-8 rounded-lg transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub {config.socialText}
                  </Clerk.Connection>
                </div>
              </div>

              <div className="text-center">
                <p className="text-base sm:text-lg text-gray-600">
                  {config.bottomText}{" "}
                  <Link
                    href={config.bottomLink.href}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-base sm:text-lg"
                  >
                    {config.bottomLink.text}
                  </Link>
                </p>
              </div>
            </div>
          </SignIn.Step>

          <SignIn.Step name="verifications">
            <SignIn.Strategy name="password">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 md:space-y-12">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    輸入密碼
                  </h1>
                  <p className="text-gray-500">請輸入您的帳戶密碼</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Clerk.Field
                    name="password"
                    className="space-y-1 sm:space-y-2"
                  >
                    <Clerk.Label className="block text-sm font-semibold text-gray-700">
                      密碼
                    </Clerk.Label>
                    <Clerk.Input
                      type="password"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="請輸入密碼"
                    />
                    <Clerk.FieldError className="text-sm text-red-500" />
                  </Clerk.Field>

                  <SignIn.Action
                    submit
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    登入
                  </SignIn.Action>

                  <div className="text-center">
                    <SignIn.Action
                      navigate="forgot-password"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      忘記密碼？
                    </SignIn.Action>
                  </div>
                </div>
              </div>
            </SignIn.Strategy>

            <SignIn.Strategy name="email_code">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 md:space-y-12">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    檢查您的電子郵件
                  </h1>
                  <p className="text-gray-500">
                    我們已發送驗證碼到您的電子郵件地址
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Clerk.Field name="code" className="space-y-1 sm:space-y-2">
                    <Clerk.Label className="block text-sm font-semibold text-gray-700">
                      驗證碼
                    </Clerk.Label>
                    <Clerk.Input
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-center text-base sm:text-lg font-mono tracking-wider"
                      placeholder="輸入驗證碼"
                    />
                    <Clerk.FieldError className="text-sm text-red-500" />
                  </Clerk.Field>

                  <SignIn.Action
                    submit
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    驗證並登入
                  </SignIn.Action>
                </div>
              </div>
            </SignIn.Strategy>
          </SignIn.Step>
        </SignIn.Root>
      ) : (
        <SignUp.Root>
          <SignUp.Step name="start">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 md:space-y-12">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {config.title}
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  {config.subtitle}
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <Clerk.Field
                    name="emailAddress"
                    className="space-y-3 sm:space-y-4"
                  >
                    <Clerk.Label className="block text-base sm:text-lg font-medium text-gray-700">
                      電子郵件地址
                    </Clerk.Label>
                    <Clerk.Input
                      className="w-full px-4 sm:px-6 py-3 sm:py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-lg sm:text-xl placeholder-gray-400"
                      placeholder="請輸入您的電子郵件"
                    />
                    <Clerk.FieldError className="text-base text-red-500" />
                  </Clerk.Field>

                  <Clerk.Field
                    name="password"
                    className="space-y-3 sm:space-y-4"
                  >
                    <Clerk.Label className="block text-base sm:text-lg font-medium text-gray-700">
                      密碼
                    </Clerk.Label>
                    <Clerk.Input
                      type="password"
                      className="w-full px-4 sm:px-6 py-3 sm:py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-lg sm:text-xl placeholder-gray-400"
                      placeholder="請輸入密碼"
                    />
                    <Clerk.FieldError className="text-base text-red-500" />
                  </Clerk.Field>
                </div>

                <SignUp.Action
                  submit
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 sm:py-5 px-6 sm:px-8 rounded-lg transition-all duration-300 text-lg sm:text-xl"
                >
                  {config.submitText}
                </SignUp.Action>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-base sm:text-lg">
                    <span className="px-4 sm:px-6 bg-white text-gray-500">
                      或使用社交媒體
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Clerk.Connection
                    name="google"
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 sm:py-5 px-4 sm:px-8 rounded-lg transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google {config.socialText}
                  </Clerk.Connection>

                  <Clerk.Connection
                    name="github"
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 sm:py-5 px-4 sm:px-8 rounded-lg transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub {config.socialText}
                  </Clerk.Connection>
                </div>
              </div>

              <div className="text-center">
                <p className="text-base sm:text-lg text-gray-600">
                  {config.bottomText}{" "}
                  <Link
                    href={config.bottomLink.href}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-base sm:text-lg"
                  >
                    {config.bottomLink.text}
                  </Link>
                </p>
              </div>
            </div>
          </SignUp.Step>

          <SignUp.Step name="verifications">
            <SignUp.Strategy name="email_code">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 md:space-y-12">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    驗證電子郵件
                  </h1>
                  <p className="text-gray-500">
                    我們已發送驗證碼到您的電子郵件地址
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Clerk.Field name="code" className="space-y-1 sm:space-y-2">
                    <Clerk.Label className="block text-sm font-semibold text-gray-700">
                      驗證碼
                    </Clerk.Label>
                    <Clerk.Input
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-center text-base sm:text-lg font-mono tracking-wider"
                      placeholder="輸入驗證碼"
                    />
                    <Clerk.FieldError className="text-sm text-red-500" />
                  </Clerk.Field>

                  <SignUp.Action
                    submit
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    驗證電子郵件
                  </SignUp.Action>
                </div>
              </div>
            </SignUp.Strategy>
          </SignUp.Step>

          <SignUp.Step name="continue">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 md:space-y-12">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  完成註冊
                </h1>
                <p className="text-gray-500">請填寫剩餘資料</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Clerk.Field
                  name="firstName"
                  className="space-y-1 sm:space-y-2"
                >
                  <Clerk.Label className="block text-sm font-medium text-gray-700">
                    名字
                  </Clerk.Label>
                  <Clerk.Input className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base sm:text-lg" />
                  <Clerk.FieldError className="text-sm text-red-600" />
                </Clerk.Field>

                <Clerk.Field name="lastName" className="space-y-1 sm:space-y-2">
                  <Clerk.Label className="block text-sm font-medium text-gray-700">
                    姓氏
                  </Clerk.Label>
                  <Clerk.Input className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base sm:text-lg" />
                  <Clerk.FieldError className="text-sm text-red-600" />
                </Clerk.Field>

                <SignUp.Action
                  submit
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  完成註冊
                </SignUp.Action>
              </div>
            </div>
          </SignUp.Step>
        </SignUp.Root>
      )}
      <div id="clerk-captcha" />
    </>
  );
}
