'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="text-sm text-gray-500">加载中...</div>
  }

  if (!user) {
    return <div className="text-sm text-gray-500">未登录</div>
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
        {user.email?.[0]?.toUpperCase() || 'U'}
      </div>
      <div>
        <div className="font-medium">{user.email}</div>
        <div className="text-gray-500 text-xs">已登录</div>
      </div>
    </div>
  )
}