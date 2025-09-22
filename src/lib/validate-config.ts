export function validateApiConfig() {
  const errors = [];
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your-key-here') || apiKey.includes('xxxxxxxx')) {
    errors.push('❌ OPENROUTER_API_KEY 未正确配置');
  }
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    errors.push('⚠️ NEXT_PUBLIC_APP_URL 未配置，将使用默认值');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config: {
      apiKey: apiKey ? apiKey.substring(0, 10) + '...' : '未设置',
      appUrl: appUrl || 'http://localhost:3000',
      model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1'
    }
  };
}

export async function testApiConnection() {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_title',
        text: '测试文本'
      })
    });
    
    const result = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}