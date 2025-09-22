import { NextRequest, NextResponse } from 'next/server';

interface AIRequest {
  action: 'polish' | 'generate_title' | 'generate_tags';
  text: string;
}

const prompts = {
  polish: (text: string) => `
你是一位专业的中文编辑。请仔细润色以下文本，使其更流畅、清晰、专业，同时保持原文的核心意思。不要添加任何解释，只返回润色后的文本内容。

原文：
${text}

润色后的文本：`,

  generate_title: (text: string) => `
你是一位标题党大师。请根据以下内容，生成一个最能概括其核心思想的、简洁有力的中文标题。不要任何多余的解释，只返回标题本身。

内容：
${text}

标题：`,

  generate_tags: (text: string) => `
你是一位内容分析专家。请为以下文本提取3到5个最相关的关键词作为标签。请以JSON数组的格式返回，例如：["标签A", "标签B"]。不要添加任何其他解释。

文本：
${text}

标签：`
};

export async function POST(request: NextRequest) {
  try {
    const { action, text }: AIRequest = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: '文本不能为空' },
        { status: 400 }
      );
    }

    // 验证action参数
    if (!['polish', 'generate_title', 'generate_tags'].includes(action)) {
      return NextResponse.json(
        { error: '无效的操作类型' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
      return NextResponse.json(
        { 
          error: 'API密钥未正确配置',
          details: '请在.env.local文件中设置正确的OPENROUTER_API_KEY',
          fix: '访问 https://openrouter.ai/keys 获取API密钥'
        },
        { status: 500 }
      );
    }

    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1';
    const prompt = prompts[action](text);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AI Personal Notebook',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'API密钥无效',
            details: '请检查您的OpenRouter API密钥是否正确',
            fix: '访问 https://openrouter.ai/keys 确认密钥有效性'
          },
          { status: 401 }
        );
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { 
            error: 'API调用频率超限',
            details: '请稍后再试',
            fix: '等待几分钟后重试'
          },
          { status: 429 }
        );
      }

      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content?.trim();

    if (!result) {
      throw new Error('Empty response from AI');
    }

    let processedResult: string | string[];

    switch (action) {
      case 'polish':
      case 'generate_title':
        processedResult = result;
        break;
      case 'generate_tags':
        try {
          // Try to parse as JSON array
          processedResult = JSON.parse(result);
          if (!Array.isArray(processedResult)) {
            throw new Error('Invalid tags format');
          }
        } catch (_error) {
          // Fallback: split by comma or newline
          processedResult = result
            .replace(/[\[\]"']/g, '')
            .split(/[,\n]+/)
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
            .slice(0, 5);
        }
        break;
      default:
        processedResult = result;
    }

    return NextResponse.json({ result: processedResult });

  } catch (error) {
    console.error('AI processing error:', error);
    
    return NextResponse.json(
      { error: 'AI处理失败，请稍后重试' },
      { status: 500 }
    );
  }
}