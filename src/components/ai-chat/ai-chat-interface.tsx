'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Copy, RefreshCw, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModelSelector } from './model-selector';
import { PromptTemplates } from './prompt-templates';
import { useAIChat } from '@/hooks/useAIChat';
import { cn } from '@/lib/utils';



export function AIChatInterface() {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash-image');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageQuality, setImageQuality] = useState<'standard' | 'high' | 'ultra'>('high');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPromptSelectorOpen, setIsPromptSelectorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    retryCount
  } = useAIChat(selectedModel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    // 发送消息，如果有图片则一起发送
    await sendMessage(message, selectedImages.length > 0 ? selectedImages : undefined, imageQuality);

    // 发送后清除图片
    if (selectedImages.length > 0) {
      removeAllImages();
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    setIsPromptSelectorOpen(false);
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 限制最多5张图片
    if (selectedImages.length + files.length > 5) {
      alert('最多只能上传5张图片');
      return;
    }

    const newImages: string[] = [];
    let processedCount = 0;

    console.log(`[Image Upload] 开始处理 ${files.length} 个图片文件`);

    Array.from(files).forEach((file) => {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert(`文件 ${file.name} 不是图片格式`);
        processedCount++;
        return;
      }

      // 验证文件大小 (最大10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`图片 ${file.name} 大小超过10MB限制`);
        processedCount++;
        return;
      }

      console.log(`[Image Upload] 处理文件: ${file.name}, 类型: ${file.type}, 大小: ${file.size} bytes`);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        console.log(`[Image Upload] 文件 ${file.name} 处理完成`);
        console.log(`[Image Upload] URL前缀: ${imageUrl?.substring(0, 50)}...`);
        console.log(`[Image Upload] URL长度: ${imageUrl?.length || 0}`);

        if (imageUrl) {
          newImages.push(imageUrl);
          console.log(`[Image Upload] 成功添加图片，当前新图片数量: ${newImages.length}`);
        }
        processedCount++;

        // 当所有文件都处理完成后，更新状态
        if (processedCount === files.length) {
          console.log(`[Image Upload] 所有文件处理完成，新图片数量: ${newImages.length}`);
          if (newImages.length > 0) {
            console.log(`[Image Upload] 更新状态，添加 ${newImages.length} 张图片`);
            setSelectedImages(prev => {
              const updated = [...prev, ...newImages];
              console.log(`[Image Upload] 状态更新完成，总图片数量: ${updated.length}`);
              return updated;
            });
          }
        }
      };
      reader.onerror = (error) => {
        console.error(`[Image Upload] 读取文件 ${file.name} 失败:`, error);
        processedCount++;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllImages = () => {
    setSelectedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const handleExport = () => {
    const chatData = {
      messages,
      model: selectedModel,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 测试AI图片生成功能
  const testAIGeneration = async () => {
    const testMessage = "生成一张简单的测试图片，比如一个红色的圆形";
    console.log('[Test] 发送测试消息:', testMessage);
    console.log('[Test] 图片质量级别:', imageQuality);
    await sendMessage(testMessage, undefined, imageQuality);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">AI 智能对话</h2>
          <ModelSelector
            value={selectedModel}
            onChange={setSelectedModel}
          />
          {(selectedModel.includes('gemini-2.5-flash-image') || selectedModel.includes('image')) && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">图片质量:</span>
              <select
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value as 'standard' | 'high' | 'ultra')}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">标准</option>
                <option value="high">高质量</option>
                <option value="ultra">超高质量</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <PromptTemplates
            onSelect={handlePromptSelect}
            isOpen={isPromptSelectorOpen}
            onOpenChange={setIsPromptSelectorOpen}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={testAIGeneration}
            className="bg-green-100 hover:bg-green-200 text-green-700"
            title="测试AI图片生成"
          >
            🎨 测试
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">开始对话</h3>
              <p className="text-gray-600">
                选择一个AI模型，开始您的智能对话体验
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "flex gap-3 max-w-2xl",
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "rounded-lg px-6 py-4",
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200'
                    )}
                  >
                    {/* 显示多张图片 */}
                    {message.imageUrls && message.imageUrls.length > 0 && (
                      <div className="mb-3">
                        {(() => {
                          console.log(`[Message Display] ${message.role}消息包含 ${message.imageUrls!.length} 张图片`);
                          message.imageUrls!.forEach((url, index) => {
                            console.log(`[Message Display] 图片 ${index + 1} URL长度: ${url.length}`);
                            console.log(`[Message Display] 图片 ${index + 1} URL前缀: ${url.substring(0, 50)}...`);
                            console.log(`[Message Display] 图片 ${index + 1} 是否base64: ${url.startsWith('data:')}`);
                          });
                          return null;
                        })()}
                        <div className={cn(
                          "grid gap-2",
                          message.imageUrls.length === 1 ? "grid-cols-1" :
                          message.imageUrls.length === 2 ? "grid-cols-2" :
                          "grid-cols-3"
                        )}>
                          {message.imageUrls.map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={imageUrl}
                                alt={`图片 ${imgIndex + 1}`}
                                className={cn(
                                  "object-cover rounded-lg border border-gray-300",
                                  message.imageUrls!.length === 1 ? "max-w-xs max-h-48" :
                                  "w-full h-24"
                                )}
                                onLoad={() => console.log(`[Message Display] 图片 ${imgIndex + 1} 加载成功`)}
                                onError={(e) => console.error(`[Message Display] 图片 ${imgIndex + 1} 加载失败:`, e)}
                              />
                              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                AI生成
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {message.content || (message.imageUrls && message.imageUrls.length > 0 ? '图片生成完成' : '无内容')}
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{message.model}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => handleCopy(message.content)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm text-gray-500">AI正在处理中...</span>
                </div>
                {retryCount > 0 && (
                  <div className="text-xs text-orange-600 mt-1">
                    🔄 第 {retryCount} 次重试中...
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* 多张图片预览 */}
          {selectedImages.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                {selectedImages.map((imageUrl, index) => {
                  console.log(`[Image Preview] 渲染图片 ${index + 1}, URL长度: ${imageUrl.length}`);
                  console.log(`[Image Preview] 图片 ${index + 1} URL前缀: ${imageUrl.substring(0, 50)}...`);
                  return (
                    <div key={index} className="relative inline-block">
                      <img
                        src={imageUrl}
                        alt={`图片 ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        onLoad={() => console.log(`[Image Preview] 图片 ${index + 1} 加载成功`)}
                        onError={(e) => console.error(`[Image Preview] 图片 ${index + 1} 加载失败:`, e)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-100"
                        onClick={() => removeImage(index)}
                        title="移除图片"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}

                {selectedImages.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAllImages}
                    className="text-red-600 hover:text-red-800"
                    title="移除所有图片"
                  >
                    <X className="w-4 h-4 mr-1" />
                    清除全部
                  </Button>
                )}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                已选择 {selectedImages.length} 张图片（最多5张）
              </div>
              <div className="text-xs text-orange-600 mt-1">
                💡 提示：图片不会保存到聊天记录中，请放心使用
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={selectedImages.length > 0 ? `已选择${selectedImages.length}张图片，描述图片内容或提出问题...` : "输入您的问题..."}
              className="flex-1 resize-none min-h-[80px] max-h-[200px] text-base"
              disabled={isLoading}
            />

            {/* 图片上传按钮 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleImageSelect}
              disabled={isLoading}
              className="self-end"
              title="上传图片"
            >
              <Image className="w-4 h-4" />
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}