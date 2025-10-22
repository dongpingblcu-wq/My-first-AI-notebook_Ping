# 🔧 多模型支持配置方案

## 📋 模型分类

### 1. 文本对话模型（原有）
- **用途**：普通文本对话、问答、分析
- **特点**：响应快，成本低，适合日常对话

### 2. 图片生成模型（新增）
- **用途**：AI图片生成、图像分析
- **特点**：支持图像生成，质量高，适合创意任务

## 🚀 环境变量配置方案

### 方案A：分离式配置（推荐）

```bash
# 文本对话模型
OPENROUTER_MODEL_TEXT=deepseek/deepseek-chat-v3.1
# 或您之前使用的模型：openai/gpt-3.5-turbo 等

# 图片生成模型
OPENROUTER_MODEL_IMAGE=google/gemini-2.5-flash-image

# 默认模型（可选）
OPENROUTER_MODEL_DEFAULT=deepseek/deepseek-chat-v3.1
```

### 方案B：智能路由配置

```bash
# 主模型（根据功能自动选择）
OPENROUTER_MODEL_MAIN=auto

# 特定功能模型
OPENROUTER_MODEL_CHAT=deepseek/deepseek-chat-v3.1
OPENROUTER_MODEL_IMAGE=google/gemini-2.5-flash-image
OPENROUTER_MODEL_CODE=codellama/codellama-7b-instruct
```

## 🔧 实施步骤

### 步骤1：更新环境变量

**在Vercel控制台中添加这些新变量：**

```bash
# 基础API配置（保持不变）
OPENROUTER_API_KEY=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
NEXT_PUBLIC_OPENROUTER_API_KEY=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

# 多模型配置（新增）
OPENROUTER_MODEL_TEXT=deepseek/deepseek-chat-v3.1  # 您原来的模型
OPENROUTER_MODEL_IMAGE=google/gemini-2.5-flash-image  # NanoBanana模型

# Supabase配置（保持不变）
NEXT_PUBLIC_SUPABASE_URL=https://xxkwuezasigltjcpwiqn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY4NDAsImV4cCI6MjA3NjAwMjg0MH0.Bhp4Ns_vr1HWNLksOly3K4glx3SzbZ3EX2iWX4k5H1k
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQyNjg0MCwiZXhwIjoyMDc2MDAyODQwfQ.3dhhlXgmOdPVjjI8uOAZRhB-eBfDTudLW8CWS1tqbVs
```

### 步骤2：更新代码逻辑

让我修改代码来支持多模型选择。