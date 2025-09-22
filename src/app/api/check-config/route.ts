import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  const isApiKeyValid = apiKey && !apiKey.includes('your-key-here') && !apiKey.includes('xxxxxxxx');
  
  return NextResponse.json({
    configured: isApiKeyValid,
    apiKeyStatus: isApiKeyValid ? '已配置' : '未配置或无效',
    appUrl: appUrl || 'http://localhost:3000',
    model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1',
    nextSteps: isApiKeyValid ? [] : [
      '访问 https://openrouter.ai/keys 获取API密钥',
      '将密钥复制到 .env.local 文件的 OPENROUTER_API_KEY',
      '重启开发服务器'
    ]
  });
}