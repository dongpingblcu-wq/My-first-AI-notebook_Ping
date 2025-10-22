'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EmailAuth } from '@/components/auth/email-auth'
import { UserInfo } from '@/components/auth/user-info'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function TestAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    initAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: { user: User | null } | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载认证测试中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">认证功能测试</h1>

        {/* 用户状态 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">用户状态</h2>
          {user ? (
            <div className="space-y-2">
              <UserInfo />
              <div className="text-sm text-gray-600">
                用户ID: {user.id}
              </div>
              <div className="text-sm text-gray-600">
                创建时间: {new Date(user.created_at).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">未登录用户</p>
          )}
        </div>

        {/* 登录注册 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{user ? '用户信息' : '登录/注册'}</h2>
          {!user && <EmailAuth />}
        </div>

        {/* 返回主页 */}
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            返回主页面
          </Link>
        </div>
      </div>
    </div>
  )
}