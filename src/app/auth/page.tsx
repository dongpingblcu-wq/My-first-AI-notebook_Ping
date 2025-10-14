'use client'

import { EmailAuth } from '@/components/auth/email-auth'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI个人工作台
          </h1>
          <p className="text-gray-600 mb-8">
            登录您的账户，开始使用AI功能
          </p>
        </div>

        <EmailAuth />

        <div className="text-center mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            返回主页面
          </a>
        </div>
      </div>
    </div>
  )
}