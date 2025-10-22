# 🔧 环境变量配置指南

## 📋 必需的环境变量

### AI服务配置（方案二：智能路由配置 - 推荐）
```bash
# OpenRouter API密钥 - 用于AI对话和图片生成
OPENROUTER_API_KEY=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

# 公开的API密钥 - 用于客户端
NEXT_PUBLIC_OPENROUTER_API_KEY=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

# 多模型智能路由配置（方案二）
# 文本对话模型
OPENROUTER_MODEL_TEXT=deepseek/deepseek-chat-v3.1
# 图片生成模型（NanoBanana）
OPENROUTER_MODEL_IMAGE=google/gemini-2.5-flash-image
# 默认模型（向后兼容）
OPENROUTER_MODEL=google/gemini-2.5-flash-image
```

### AI服务配置（方案一：单模型配置）
```bash
# OpenRouter API密钥 - 用于AI对话和图片生成
OPENROUTER_API_KEY=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

# 公开的API密钥 - 用于客户端
NEXT_PUBLIC_OPENROUTER_API_KEY=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

# 使用的AI模型（单模型配置）
OPENROUTER_MODEL=google/gemini-2.5-flash-image
```

### Supabase数据库配置
```bash
# Supabase项目URL
NEXT_PUBLIC_SUPABASE_URL=https://xxkwuezasigltjcpwiqn.supabase.co

# Supabase匿名密钥 - 用于客户端认证
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY4NDAsImV4cCI6MjA3NjAwMjg0MH0.Bhp4Ns_vr1HWNLksOly3K4glx3SzbZ3EX2iWX4k5H1k

# Supabase服务角色密钥 - 用于服务端管理
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQyNjg0MCwiZXhwIjoyMDc2MDAyODQwfQ.3dhhlXgmOdPVjjI8uOAZRhB-eBfDTudLW8CWS1tqbVs
```

### 应用配置
```bash
# 应用URL - 部署后更新为您的实际域名
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🚀 Vercel部署配置步骤

### 1. 登录Vercel控制台
- 访问 https://vercel.com/dashboard
- 使用您的账户登录

### 2. 找到您的项目
- 在项目列表中找到 "My-first-AI-notebook-Ping"
- 点击进入项目详情页

### 3. 配置环境变量
1. 点击项目顶部的 "Settings" 标签
2. 在左侧菜单中选择 "Environment Variables"
3. 添加以下环境变量（推荐使用方案二：智能路由配置）：

**方案二：智能路由配置（推荐）**
| 名称 | 值 | 环境 |
|------|----|------|
| `OPENROUTER_API_KEY` | `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` | Production, Preview, Development |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | `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` | Production, Preview, Development |
| `OPENROUTER_MODEL_TEXT` | `deepseek/deepseek-chat-v3.1` | Production, Preview, Development |
| `OPENROUTER_MODEL_IMAGE` | `google/gemini-2.5-flash-image` | Production, Preview, Development |
| `OPENROUTER_MODEL` | `google/gemini-2.5-flash-image` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxkwuezasigltjcpwiqn.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY4NDAsImV4cCI6MjA3NjAwMjg0MH0.Bhp4Ns_vr1HWNLksOly3K4glx3SzbZ3EX2iWX4k5H1k` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQyNjg0MCwiZXhwIjoyMDc2MDAyODQwfQ.3dhhlXgmOdPVjjI8uOAZRhB-eBfDTudLW8CWS1tqbVs` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production, Preview |

**方案一：单模型配置（简化版）**
| 名称 | 值 | 环境 |
|------|----|------|
| `OPENROUTER_API_KEY` | `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` | Production, Preview, Development |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | `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` | Production, Preview, Development |
| `OPENROUTER_MODEL` | `google/gemini-2.5-flash-image` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxkwuezasigltjcpwiqn.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY4NDAsImV4cCI6MjA3NjAwMjg0MH0.Bhp4Ns_vr1HWNLksOly3K4glx3SzbZ3EX2iWX4k5H1k` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3d1ZXphc2lnbHRqY3B3aXFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQyNjg0MCwiZXhwIjoyMDc2MDAyODQwfQ.3dhhlXgmOdPVjjI8uOAZRhB-eBfDTudLW8CWS1tqbVs` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production, Preview |

### 4. 重新部署
1. 返回项目主页
2. 点击 "Deploy" 或 "Redeploy" 按钮
3. 选择最新的提交记录
4. 等待部署完成

## 🧪 部署验证清单

部署完成后，请测试以下功能：

### ✅ 基础功能测试
- [ ] 访问首页是否正常加载
- [ ] 用户注册/登录功能
- [ ] AI对话功能（文本）
- [ ] 聊天记录保存

### ✅ 多模型智能路由测试（方案二）
- [ ] 文本对话自动使用文本模型（如DeepSeek）
- [ ] 图片生成请求自动切换到图片模型（Gemini 2.5 Flash Image）
- [ ] 界面显示当前实际使用的模型
- [ ] 上传图片时自动使用图片模型

### ✅ AI图片生成功能测试
- [ ] 测试提示词："生成一张红色的圆形"
- [ ] 测试中文提示词："生成一只可爱的小猫"
- [ ] 测试图片质量选项（标准/高质量/超高质量）
- [ ] 测试多图片上传和分析

### ✅ 错误处理测试
- [ ] 测试网络错误处理
- [ ] 测试API错误提示
- [ ] 测试重试机制

## 📊 配置方案对比

### 方案二：智能路由配置（推荐）
**优点：**
- ✅ 自动根据请求类型选择最优模型
- ✅ 文本对话使用专门的文本模型，响应更快
- ✅ 图片生成使用专门的图片模型，质量更高
- ✅ 成本优化：文本请求使用更便宜的模型
- ✅ 界面显示当前实际使用的模型

**适用场景：**
- 需要同时进行文本对话和图片生成
- 追求最佳性能和成本效益
- 希望自动化模型选择

### 方案一：单模型配置
**优点：**
- ✅ 配置简单，部署快速
- ✅ 所有功能使用统一模型
- ✅ 适合单一需求场景

**缺点：**
- ❌ 无法针对不同类型的请求优化
- ❌ 文本对话可能不如专业文本模型
- ❌ 成本可能更高

**适用场景：**
- 快速原型开发
- 主要需求为图片生成
- 简化配置优先

## 🔧 故障排除

### 常见问题

1. **部署失败**
   - 检查环境变量是否正确配置
   - 查看部署日志中的错误信息
   - 确认所有依赖项已正确安装

2. **API错误**
   - 验证OpenRouter API密钥是否有效
   - 检查API配额是否充足
   - 确认网络连接正常

3. **数据库连接错误**
   - 验证Supabase配置是否正确
   - 检查数据库连接状态
   - 确认用户权限设置

### 获取帮助
- 查看部署日志：Vercel控制台 → Deployments → 查看日志
- 检查GitHub Actions：GitHub仓库 → Actions标签
- 本地测试：`npm run dev` 确保本地运行正常

## 🎯 一键部署

如果您想重新创建项目，可以使用以下链接：

```
https://vercel.com/new/clone?repository-url=https://github.com/dongpingblcu-wq/My-first-AI-notebook_Ping.git
```

**部署完成后，请将 `NEXT_PUBLIC_APP_URL` 更新为您的实际域名。**