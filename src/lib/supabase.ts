import { createClient } from '@supabase/supabase-js'

// 安全地获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// 检查必需的配置
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase配置不完整。某些功能可能无法正常使用。');
  console.warn('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// 创建带有错误处理的客户端
const createSafeClient = (url: string, key: string) => {
  try {
    if (!url || !key) {
      throw new Error('Supabase配置缺失');
    }
    return createClient(url, key);
  } catch (error) {
    console.error('创建Supabase客户端失败:', error);
    // 返回一个模拟的客户端，避免应用崩溃
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase未配置') }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase未配置') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase未配置') }),
            data: null,
            error: new Error('Supabase未配置')
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({ data: null, error: new Error('Supabase未配置') })
            })
          }),
          update: () => ({
            eq: () => ({
              select: () => ({
                single: async () => ({ data: null, error: new Error('Supabase未配置') })
              })
            })
          }),
          delete: () => ({
            eq: () => ({
              select: () => ({
                single: async () => ({ data: null, error: new Error('Supabase未配置') })
              })
            })
          })
        })
      })
    } as Database
  }
}

// 客户端组件使用的客户端
export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey);

// 服务端使用的客户端（具有更高权限）- 只在服务端密钥存在时创建
export const supabaseAdmin = supabaseServiceKey
  ? createSafeClient(supabaseUrl, supabaseServiceKey)
  : supabase; // 如果没有服务密钥，使用普通客户端