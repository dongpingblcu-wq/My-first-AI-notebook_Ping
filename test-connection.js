const { createClient } = require('@supabase/supabase-js')

// 从环境变量读取配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxkwuezasigltjcpwiqn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY4NDAsImV4cCI6MjA3NjAwMjg0MH0.Bhp4Ns_vr1HWNLksOly3K4glx3SzbZ3EX2iWX4k5H1k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🧪 测试Supabase连接...')

  try {
    // 测试1: 基础连接
    console.log('📡 测试基础连接...')
    const { data, error } = await supabase.from('notes').select('*').limit(1)

    if (error) {
      console.error('❌ 基础连接失败:', error.message)
      return false
    }

    console.log('✅ 基础连接成功!')
    console.log('📊 查询结果:', data)

    // 测试2: 测试表结构
    console.log('\n📋 测试表结构...')
    const tables = ['notes', 'todos', 'projects', 'chat_messages', 'pomodoro_sessions']

    for (const table of tables) {
      try {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.log(`⚠️  ${table} 表访问错误:`, countError.message)
        } else {
          console.log(`✅ ${table} 表: 可访问 (行数: ${count || 0})`)
        }
      } catch (err) {
        console.log(`❌ ${table} 表测试失败:`, err.message)
      }
    }

    // 测试3: 测试RLS策略
    console.log('\n🔒 测试RLS策略...')
    try {
      const { data: testData, error: testError } = await supabase
        .from('notes')
        .insert([{
          title: '测试笔记',
          content: '这是测试内容',
          user_id: '00000000-0000-0000-0000-000000000000'
        }])
        .select()

      if (testError) {
        console.log('✅ RLS策略正常工作 (插入被拒绝):', testError.message)
      } else {
        console.log('⚠️  RLS策略可能未生效 (插入成功)')
        // 清理测试数据
        if (testData && testData[0]) {
          await supabase.from('notes').delete().eq('id', testData[0].id)
        }
      }
    } catch (err) {
      console.log('✅ RLS策略测试完成:', err.message)
    }

    console.log('\n🎉 所有测试完成!')
    return true

  } catch (error) {
    console.error('❌ 连接测试异常:', error.message)
    return false
  }
}

// 运行测试
testConnection().then(success => {
  console.log('\n🏁 测试结果:', success ? '✅ 成功' : '❌ 失败')
  process.exit(success ? 0 : 1)
})