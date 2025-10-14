'use client'

import { useEffect, useState } from 'react'
import { EmailAuth } from '@/components/auth/email-auth'
import { UserInfo } from '@/components/auth/user-info'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function TestAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<string[]>([])

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      // 运行认证测试
      await runAuthTests()
    }

    initAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const runAuthTests = async () => {
    const results: string[] = []

    try {
      // 测试1: 基础连接
      const { data, error } = await supabase.from('notes').select('*').limit(1)
      if (error) {
        results.push(`❌ 数据库连接失败: ${error.message}`)
      } else {
        results.push('✅ 数据库连接成功')
      }

      // 测试2: 认证服务连接
      const { data: authData, error: authError } = await supabase.auth.getSession()
      if (authError) {
        results.push(`❌ 认证服务连接失败: ${authError.message}`)
      } else {
        results.push('✅ 认证服务连接成功')
      }

      // 测试3: 检查是否需要翻墙
      results.push('🔍 检查认证服务访问性...')

      setTestResult(results)
    } catch (error: any) {
      results.push(`❌ 测试异常: ${error.message}`)
      setTestResult(results)
    }
  }

  const testAnonymousAccess = async () => {
    try {
      const { data, error } = await supabase.from('notes').select('*').limit(1)
      if (error) {
        alert(`匿名访问失败: ${error.message}`)
      } else {
        alert(`匿名访问成功！找到 ${data?.length || 0} 条记录`)
      }
    } catch (error: any) {
      alert(`测试失败: ${error.message}`)
    }
  }

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

        {/* 连接测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">连接测试</h2>
          <div className="space-y-2">
            {testResult.map((result, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                {result}
              </div>
            ))}
          </div>
          <button
            onClick={runAuthTests}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重新测试
          </button>
        </div>

        {/* 功能测试 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">功能测试</h2>
          <div className="space-y-4"
            <button
              onClick={testAnonymousAccess}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              测试匿名访问
            </button>

            {user && (
              <>
                <button
                  onClick={() => {
                    supabase.auth.signOut().then(() => {
                      alert('已退出登录')
                    })
                  }}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  退出登录
                </button>
                <a
                  href="/"
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block"
                >
                  返回主页面
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}