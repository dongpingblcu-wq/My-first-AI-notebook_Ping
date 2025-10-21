'use client';

import { useState, useCallback, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  imageUrls?: string[]; // 改为支持多张图片
}

interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, imageUrls?: string[], imageQuality?: 'standard' | 'high' | 'ultra') => Promise<void>;
  clearChat: () => void;
  loadHistory: () => void;
  setSaveImagesToHistory: (save: boolean) => void; // 添加控制函数
  retryCount?: number; // 添加重试次数
}

export function useAIChat(model: string): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loadHistory = useCallback(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(`ai-chat-history-${model}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((msg: { content: string; role: string; timestamp: string; model?: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, [model]);

  // 添加一个选项来控制是否保存图片（默认不保存）
  const [saveImagesToHistory, setSaveImagesToHistory] = useState(false);

  const saveHistory = useCallback((newMessages: Message[]) => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;

    // 为了节省localStorage空间，默认不保存图片数据
    const messagesToSave = saveImagesToHistory ? newMessages : newMessages.map(msg => ({
      ...msg,
      imageUrls: undefined // 不保存图片数据到localStorage以节省空间
    }));

    try {
      localStorage.setItem(`ai-chat-history-${model}`, JSON.stringify(messagesToSave));
    } catch (error) {
      console.warn('Failed to save chat history to localStorage (可能由于图片数据过大):', error);

      // 如果仍然超出配额，尝试只保存最近的几条消息
      const recentMessages = messagesToSave.slice(-5); // 只保存最近5条
      try {
        localStorage.setItem(`ai-chat-history-${model}`, JSON.stringify(recentMessages));
        console.log('已降级保存为最近5条消息（不含图片）');
      } catch (fallbackError) {
        console.error('Failed to save even reduced chat history:', fallbackError);
        // 最后尝试：只保存文本消息，不含任何元数据
        const minimalMessages = messagesToSave.slice(-3).map(msg => ({
          content: msg.content,
          role: msg.role
        }));
        try {
          localStorage.setItem(`ai-chat-history-${model}`, JSON.stringify(minimalMessages));
          console.log('已降级保存为极简消息格式');
        } catch (finalError) {
          console.error('无法保存任何聊天记录到本地存储:', finalError);
          // 如果完全无法保存，清空存储
          localStorage.removeItem(`ai-chat-history-${model}`);
        }
      }
    }
  }, [model]);

  const sendMessage = useCallback(async (content: string, imageUrls?: string[], imageQuality: 'standard' | 'high' | 'ultra' = 'high') => {
    setIsLoading(true);
    setRetryCount(0); // 重置重试计数

    // 优化图片生成的提示词
    let optimizedContent = content;
    if (model.includes('gemini-2.5-flash-image') || model.includes('image')) {
      // 检测是否为图片生成请求
      const imageGenerationKeywords = ['生成', '创建', '制作', '画', '图', 'image', 'generate', 'create', 'draw'];
      const isImageGeneration = imageGenerationKeywords.some(keyword =>
        content.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isImageGeneration) {
        // 根据质量级别调整提示词
        let qualityPrompt = '';
        switch (imageQuality) {
          case 'standard':
            qualityPrompt = '请生成标准质量的图片，确保基本清晰度和合理的构图。';
            break;
          case 'high':
            qualityPrompt = `请生成高质量的图片，注意以下要点：
1. 图片应该清晰、细节丰富
2. 光影效果自然
3. 色彩搭配和谐
4. 构图平衡美观
5. 避免模糊或失真的区域`;
            break;
          case 'ultra':
            qualityPrompt = `请生成超高质量的图片，达到专业级别，注意以下要点：
1. 超高清晰度，细节极其丰富
2. 完美的光影效果，明暗对比自然
3. 专业级的色彩搭配和调和
4. 黄金比例构图，视觉冲击力強
5. 无任何模糊、失真或噪点
6. 纹理和材质表现逼真
7. 景深效果自然（如适用）
8. 专业摄影级别的质感`;
            break;
        }

        // 添加图片质量优化提示 - 增强稳定性
        optimizedContent = `${content}

${qualityPrompt}

**重要要求：你必须生成一张实际的图片，而不是仅仅描述图片。请使用你的图像生成功能创建一张真实的图片。**

具体技术要求：
如果生成人物，请确保：
- 面部特征清晰自然，表情生动
- 身体比例协调，姿态自然
- 服装纹理和材质表现真实

如果生成风景，请确保：
- 远近层次分明，透视准确
- 色彩过渡自然，色调统一
- 细节丰富但不杂乱，重点突出

如果生成物体，请确保：
- 形状准确，比例正确
- 质感真实，材质特征明显
- 光影效果逼真，立体感强

**强制要求：请立即生成图片，不要只提供文字描述。图片必须真实存在并可以通过images数组返回。**`

        console.log('[Send Message] 检测到图片生成请求，已优化提示词');
        console.log(`[Send Message] 原始提示词长度: ${content.length}`);
        console.log(`[Send Message] 优化后提示词长度: ${optimizedContent.length}`);
      }
    }

    console.log(`[Send Message] 开始发送消息，内容长度: ${optimizedContent.length}`);
    console.log(`[Send Message] 图片数量: ${imageUrls?.length || 0}`);
    if (imageUrls && imageUrls.length > 0) {
      imageUrls.forEach((url, index) => {
        console.log(`[Send Message] 图片 ${index + 1} URL长度: ${url.length}`);
        console.log(`[Send Message] 图片 ${index + 1} URL前缀: ${url.substring(0, 50)}...`);
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: optimizedContent, // 使用优化后的内容
      role: 'user',
      timestamp: new Date(),
      imageUrls, // 保存多张图片URL
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    console.log(`[Send Message] 消息已添加到状态，总消息数: ${newMessages.length}`);

    try {
      console.log('Using model:', model);
      console.log('Messages count:', newMessages.length);

      // 构建消息内容，支持多张图片
      const messagesPayload = newMessages.map(msg => {
        if (msg.imageUrls && msg.imageUrls.length > 0) {
          // 构建包含多张图片的内容
          const contentParts = [
            {
              type: 'text',
              text: msg.content
            }
          ];

          // 添加所有图片
          msg.imageUrls.forEach(url => {
            contentParts.push({
              type: 'image_url',
              image_url: {
                url: url
              }
            });
          });

          return {
            role: msg.role,
            content: contentParts
          };
        } else {
          return {
            role: msg.role,
            content: msg.content
          };
        }
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messagesPayload,
          max_tokens: 4000,
          temperature: 0.7,
          imageQuality: imageQuality, // 添加图片质量参数
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiContent = data.content || '图片生成完成';

      // 记录重试次数信息
      if (data.retryCount > 0) {
        console.log(`[Send Message] 经过 ${data.retryCount} 次重试后成功`);
        setRetryCount(data.retryCount);
      }

      // 检查是否有AI生成的图片
      let aiImageUrls: string[] | undefined;
      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        console.log(`[Send Message] AI返回了 ${data.imageUrls.length} 张生成图片`);
        aiImageUrls = data.imageUrls;
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiContent,
        role: 'assistant',
        timestamp: new Date(),
        model: model,
        imageUrls: aiImageUrls, // 添加AI生成的图片
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = '抱歉，发送消息时出现了错误';

      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查您的网络连接或API配置';
        } else if (error.message.includes('401')) {
          errorMessage = 'API密钥无效，请检查您的OpenRouter API密钥';
        } else if (error.message.includes('403')) {
          errorMessage = 'API访问被拒绝，请确认您的账户权限';
        } else if (error.message.includes('429')) {
          errorMessage = 'API请求过于频繁，请稍后再试';
        } else if (error.message.includes('model')) {
          errorMessage = '模型不可用，请尝试其他模型';
        } else if (error.message.includes('重试')) {
          errorMessage = '图片生成失败，已尝试多次重试。请检查模型是否支持图片生成功能，或尝试其他提示词。';
        } else {
          errorMessage = `发送消息失败：${error.message}`;
        }
      }

      const errorResponse: Message = {
        id: Date.now().toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date(),
        model: model,
        imageUrls: undefined, // 错误响应不包含图片
      };

      const finalMessages = [...newMessages, errorResponse];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, model, saveHistory]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(`ai-chat-history-${model}`);
  }, [model]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    loadHistory,
    setSaveImagesToHistory,
    retryCount,
  };
}