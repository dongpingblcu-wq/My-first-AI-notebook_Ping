import { supabase } from './supabase'

// 测试数据库连接
export async function testSupabaseConnection() {
  try {
    // 测试基础连接
    const { data, error } = await supabase.from('notes').select('*').limit(1)

    if (error) {
      console.error('Supabase连接错误:', error)
      return false
    }

    console.log('✅ Supabase连接成功!')
    console.log('测试查询结果:', data)
    return true

  } catch (error) {
    console.error('Supabase连接异常:', error)
    return false
  }
}

// 测试认证（如果你设置了认证）
export async function testAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.log('⚠️  用户未登录或认证错误:', error.message)
      return null
    }

    console.log('✅ 用户已认证:', user?.email)
    return user

  } catch (error) {
    console.error('认证测试异常:', error)
    return null
  }
}

// 运行所有测试
export async function runAllTests() {
  console.log('🧪 开始测试Supabase连接...')

  const connectionTest = await testSupabaseConnection()
  const authTest = await testAuth()

  console.log('\n📊 测试结果汇总:')
  console.log(`数据库连接: ${connectionTest ? '✅ 通过' : '❌ 失败'}`)
  console.log(`用户认证: ${authTest ? '✅ 已登录' : '⚠️  未登录/失败'}`)

  return {
    connection: connectionTest,
    auth: authTest
  }
}