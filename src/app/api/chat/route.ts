import { NextRequest, NextResponse } from 'next/server';

interface TextContent {
  type: 'text';
  text: string;
}

interface ImageContent {
  type: 'image_url';
  image_url: { url: string };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | (TextContent | ImageContent)[];
}

interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  max_tokens?: number;
  temperature?: number;
  imageQuality?: 'standard' | 'high' | 'ultra';
  forceModel?: 'text' | 'image'; // 强制使用特定模型类型
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model, max_tokens = 4000, temperature = 0.7, imageQuality = 'high', forceModel }: ChatRequest = await request.json();

    // 针对图片生成模型优化参数
    let optimizedTemperature = temperature;
    let optimizedMaxTokens = max_tokens;
    let additionalParams = {};

    // 如果是图片生成模型，使用更适合的参数
    if (model.includes('gemini-2.5-flash-image') || model.includes('image')) {
      // 根据图片质量级别调整参数
      let qualityTemperature = 0.4;
      let qualityMaxTokens = 8000;

      switch (imageQuality) {
        case 'standard':
          qualityTemperature = 0.5;
          qualityMaxTokens = 4000;
          break;
        case 'high':
          qualityTemperature = 0.4;
          qualityMaxTokens = 8000;
          break;
        case 'ultra':
          qualityTemperature = 0.3; // 更低的温度以获得更精确的结果
          qualityMaxTokens = 12000; // 更大的token限制
          break;
      }

      optimizedTemperature = qualityTemperature;
      optimizedMaxTokens = qualityMaxTokens;

      additionalParams = {
        top_p: 0.8,
        top_k: 40,
        // 添加图片质量参数
        response_mime_type: 'application/json',
        safety_settings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      console.log(`[API Chat] 图片质量级别: ${imageQuality}`);
      console.log(`[API Chat] 优化参数 - temperature: ${optimizedTemperature}, max_tokens: ${optimizedMaxTokens}`);
    }

    // 智能模型选择逻辑
    let selectedModel = model;

    // 如果强制指定了模型类型，使用对应的模型
    if (forceModel) {
      if (forceModel === 'text' && process.env.OPENROUTER_MODEL_TEXT) {
        selectedModel = process.env.OPENROUTER_MODEL_TEXT;
        console.log(`[API Chat] 强制使用文本模型: ${selectedModel}`);
      } else if (forceModel === 'image' && process.env.OPENROUTER_MODEL_IMAGE) {
        selectedModel = process.env.OPENROUTER_MODEL_IMAGE;
        console.log(`[API Chat] 强制使用图片模型: ${selectedModel}`);
      }
    } else {
      // 自动检测请求类型并选择合适模型
      const isImageGeneration = messages.some(msg => {
        const content = msg.content;
        if (typeof content === 'string') {
          const imageGenerationKeywords = ['生成', '创建', '制作', '画', '图', 'image', 'generate', 'create', 'draw'];
          return imageGenerationKeywords.some(keyword =>
            content.toLowerCase().includes(keyword.toLowerCase())
          );
        } else if (Array.isArray(content)) {
          // 检查数组内容中是否包含图片生成关键词
          return content.some(item => {
            if (item.type === 'text' && item.text) {
              const imageGenerationKeywords = ['生成', '创建', '制作', '画', '图', 'image', 'generate', 'create', 'draw'];
              return imageGenerationKeywords.some(keyword =>
                item.text.toLowerCase().includes(keyword.toLowerCase())
              );
            }
            return false;
          });
        }
        return false;
      });

      // 检查是否包含图片URL
      const hasImageUrls = messages.some(msg =>
        Array.isArray(msg.content) && msg.content.some(item => item.type === 'image_url')
      );

      if ((isImageGeneration || hasImageUrls) && process.env.OPENROUTER_MODEL_IMAGE) {
        selectedModel = process.env.OPENROUTER_MODEL_IMAGE;
        console.log(`[API Chat] 检测到图片相关请求，自动切换到图片模型: ${selectedModel}`);
      } else if (process.env.OPENROUTER_MODEL_TEXT) {
        selectedModel = process.env.OPENROUTER_MODEL_TEXT;
        console.log(`[API Chat] 使用文本模型: ${selectedModel}`);
      }
    }

    console.log('[API Chat] 收到请求，原始模型:', model);
    console.log('[API Chat] 选择模型:', selectedModel);
    console.log('[API Chat] 消息数量:', messages.length);

    // 验证基本参数
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    if (!model || typeof model !== 'string') {
      return NextResponse.json(
        { error: '模型参数无效' },
        { status: 400 }
      );
    }

    // 验证API密钥
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

    console.log('Chat API - Original model:', model);
    console.log('Chat API - Selected model:', selectedModel);
    console.log('Chat API - Messages count:', messages.length);
    console.log('Chat API - API Key exists:', !!apiKey);

    // 检查是否为图片生成请求
    const isImageGeneration = messages.some(msg => {
      const content = msg.content;
      if (typeof content === 'string') {
        const imageGenerationKeywords = ['生成', '创建', '制作', '画', '图', 'image', 'generate', 'create', 'draw'];
        return imageGenerationKeywords.some(keyword =>
          content.toLowerCase().includes(keyword.toLowerCase())
        );
      } else if (Array.isArray(content)) {
        // 检查数组内容中是否包含图片生成关键词
        return content.some(item => {
          if (item.type === 'text' && item.text) {
            const imageGenerationKeywords = ['生成', '创建', '制作', '画', '图', 'image', 'generate', 'create', 'draw'];
            return imageGenerationKeywords.some(keyword =>
              item.text.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          return false;
        });
      }
      return false;
    });

    // 如果是图片生成请求，添加重试机制
    const maxRetries = isImageGeneration ? 3 : 1;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        console.log(`[API Chat] 尝试第 ${retryCount + 1} 次请求`);

        // 构建请求数据
        const requestBody = {
          model: selectedModel,
          messages: messages,
          max_tokens: optimizedMaxTokens,
          temperature: optimizedTemperature,
          stream: false,
          ...additionalParams
        };

        // 如果是重试且是图片生成，增强提示词
        if (retryCount > 0 && isImageGeneration) {
          console.log(`[API Chat] 第 ${retryCount + 1} 次重试，增强提示词`);

          // 在最后一次重试时使用更强的提示词
          if (retryCount === maxRetries - 1) {
            const enhancedMessages = messages.map(msg => {
              if (msg.role === 'user' && typeof msg.content === 'string') {
                return {
                  ...msg,
                  content: `${msg.content}\n\n**强制要求：你必须立即生成一张真实的图片，而不是文字描述。如果无法生成图片，请返回错误信息。**`
                };
              }
              return msg;
            });
            requestBody.messages = enhancedMessages;
          }
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'AI Personal Notebook',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Chat API - Response status:', response.status);
        console.log('Chat API - Response statusText:', response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Chat API - OpenRouter API error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });

          if (response.status === 401) {
            throw new Error('API密钥无效');
          }

          if (response.status === 429) {
            throw new Error('API调用频率超限');
          }

          if (response.status === 400) {
            throw new Error('请求参数错误');
          }

          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Chat API - Response data:', JSON.stringify(data, null, 2));

        const aiContent = data.choices[0]?.message?.content;
        const message = data.choices[0]?.message;

        // 修复：允许content为空，只要我们有其他有效数据
        if (!aiContent && !message) {
          console.log('[API Chat] 警告: AI返回的message为空');
          throw new Error('AI返回空响应');
        }

        // 检查是否有AI生成的图片
        let imageUrls: string[] = [];

        // 尝试从images字段提取
        if (message?.images && Array.isArray(message.images)) {
          console.log(`[API Chat] AI生成了 ${message.images.length} 张图片`);
          imageUrls = message.images.map((img: { type: string; image_url?: { url: string } }) => {
            if (img.type === 'image_url' && img.image_url?.url) {
              return img.image_url.url;
            }
            return null;
          }).filter(Boolean);
        }

        // 如果content中包含图片标记，尝试提取base64图片
        if (typeof aiContent === 'string') {
          // 查找base64图片数据
          const base64Regex = /data:image\/[a-zA-Z+]+;base64,[a-zA-Z0-9+/]+=*={0,2}/g;
          const base64Matches = aiContent.match(base64Regex);
          if (base64Matches) {
            console.log(`[API Chat] 在content中找到 ${base64Matches.length} 个base64图片`);
            imageUrls.push(...base64Matches);
          }
        }

        // 检查是否成功生成图片（对于图片生成请求）
        if (isImageGeneration && imageUrls.length === 0) {
          console.log(`[API Chat] 第 ${retryCount + 1} 次尝试未生成图片，准备重试`);
          retryCount++;

          // 等待一段时间后重试
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // 递增等待时间
            continue;
          }
        }

        // 成功获取响应（有或没有图片）
        return NextResponse.json({
          content: aiContent || (imageUrls.length > 0 ? '图片生成完成' : '处理完成'),
          model: data.model,
          usage: data.usage,
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
          retryCount: retryCount
        });

      } catch (error) {
        console.error(`[API Chat] 第 ${retryCount + 1} 次尝试失败:`, error);
        lastError = error;
        retryCount++;

        // 等待一段时间后重试
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
        }
      }
    }

    // 所有重试都失败
    throw lastError;

  } catch (error) {
    console.error('Chat API - Processing error:', error);

    let errorMessage = 'AI处理失败，请稍后重试';
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络连接';
      } else if (error.message.includes('Empty response')) {
        errorMessage = 'AI响应为空，请重试';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}