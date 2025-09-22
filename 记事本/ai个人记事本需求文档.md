AI-Native 个人记事本 - 产品需求文档 (PRD)
1. 项目/功能概述 (Overview)
本项目旨在开发一款现代、简约、AI 驱动的个人记事本 Web 应用。应用的核心是提供一个纯粹的写作环境，并通过集成 OpenRouter AI 服务，为用户提供智能文本润色、自动标题生成和自动标签提取三大核心功能，旨在提升写作效率与内容质量。应用的视觉风格将向苹果官网看齐，追求极简、优雅和高易用性。
2. 核心功能点 (Core Features)
笔记管理 (CRUD): 提供完整的笔记创建 (Create)、读取 (Read)、更新 (Update) 和删除 (Delete) 功能。
智能润色 (AI Polish): 用户可以选中一段文字或对整篇笔记，点击按钮调用 AI，对文本进行语法修正、风格优化和表达增强。
自动生成标题 (AI Title Generation): 基于笔记内容，一键调用 AI 生成一个简洁、贴切的标题。
自动生成标签 (AI Tagging): 基于笔记内容，一键调用 AI 自动分析并提取 3-5 个核心关键词作为笔记标签，便于归类。
苹果风格 UI: 整体界面设计遵循苹果的设计语言：大量留白、优雅的字体、简洁的图标、流畅的过渡动画。
本地数据存储: 为简化开发和保障隐私，所有笔记数据将存储在用户的浏览器本地存储 (Local Storage) 中，无需注册登录。
3. 技术规格 (Technical Specifications)
页面/组件 (Pages/Components) & 布局:
整体布局: 建议采用经典的三栏式布局，与 Apple Notes 应用类似。
Sidebar (侧边栏): 最左侧，包含“创建新笔记”按钮和设置入口。
NoteList (笔记列表): 中间栏，展示所有笔记的标题和一小段预览。当前选中的笔记有高亮状态。
Editor (编辑器): 右侧主区域，用于笔记内容的撰写和编辑。
核心 Shadcn/UI 组件:
Button: 用于“创建笔记”及 AI 功能按钮（润色、标题、标签）。
Textarea: 笔记内容的主要输入区域。
Input: 笔记标题的输入框。
Badge: 用于在标题下方或笔记列表中展示 AI 生成的标签。
Tooltip: 鼠标悬停在 AI 功能按钮上时，提供简单的功能说明。
Resizable: 用于实现三栏布局之间可拖拽调整宽度的功能。
用户流程 (User Flow):
用户打开应用，界面加载本地存储中的所有笔记，并在 NoteList 中显示。
用户点击 Sidebar 中的“创建新笔记”按钮。
NoteList 中新增一个“无标题笔记”并自动选中，Editor 区域清空并获得输入焦点。
用户在 Editor 中输入内容。笔记内容会实时自动保存到本地存储。
用户点击编辑器上方的“自动生成标题”按钮。
前端将当前笔记内容发送至后端 API。
API 调用 AI 模型后返回标题，前端将标题自动填充到 Input 框中。
用户点击“自动生成标签”按钮。
流程同上，返回的标签数组以 Badge 的形式显示在标题下方。
用户选中一段文字，然后点击“润色”按钮。
前端将选中的文本发送至后端 API。
API 返回润色后的文本，前端用返回结果替换掉用户选中的原文。
用户可以点击 NoteList 中的不同笔记，在 Editor 中切换和编辑。
数据交互 (Data Interaction):
主要交互: 前端与自身的后端 API 路由进行通信。
请求 (Request): 向后端 POST /api/ai 发送请求。
请求体 (Body):
code
JSON
{
  "action": "polish" | "generate_title" | "generate_tags",
  "text": "这是需要处理的笔记内容或选中的文本..."
}
响应 (Response): 根据 action 返回不同格式的结果。
code
JSON
// 'polish' 和 'generate_title' 的响应
{ "result": "这是润色后的文本或生成的单个标题" }

// 'generate_tags' 的响应
{ "result": ["标签1", "标签2", "技术"] }
API 接口 (API Endpoints):
POST /api/ai (用于处理所有 AI 相关请求):
请求: 接收包含 action 和 text 的 JSON 数据。
核心逻辑:
从环境变量中安全地读取 OPENROUTER_API_KEY。
根据不同的 action，构建不同的 Prompt (提示词)。
设置 OpenRouter API 的请求头，包括认证信息 (Authorization: Bearer YOUR_KEY)。
向 OpenRouter 发送请求，指定模型为 deepseek/deepseek-chat-v3.1。
解析 AI 返回的结果，提取核心内容。
将提取后的内容格式化为前端需要的 JSON 格式并返回。
响应: 返回包含 result 字段的 JSON 数据。
关键点：提示词工程 (Prompt Engineering):
润色 (polish): 你是一位专业的中文编辑。请仔细润色以下文本，使其更流畅、清晰、专业，同时保持原文的核心意思。不要添加任何解释，只返回润色后的文本内容。原文如下：\n\n{text}
生成标题 (generate_title): 你是一位标题党大师。请根据以下内容，生成一个最能概括其核心思想的、简洁有力的中文标题。不要任何多余的解释，只返回标题本身。内容如下：\n\n{text}
生成标签 (generate_tags): 你是一位内容分析专家。请为以下文本提取3到5个最相关的关键词作为标签。请以JSON数组的格式返回，例如：["标签A", "标签B"]。不要添加任何其他解释。文本如下：\n\n{text}
数据模型 (Data Models for Local Storage):
笔记对象将以 JSON 格式存储在 localStorage 中。单条笔记的结构建议如下：
code
JavaScript
{
  id: 'unique_id_string', // e.g., using Date.now() or uuid
  title: '我的笔记标题',
  content: '这是笔记的全部内容...',
  tags: ['AI', '开发', '随笔'],
  createdAt: 'iso_timestamp',
  updatedAt: 'iso_timestamp'
}
4. 技术栈建议 (Tech Stack Suggestion)
框架 (Framework): Next.js (App Router)。它非常适合这个项目，因为它集成了前端（React）和后端（API Routes），让你可以用同一个技术栈完成所有开发。
UI 库 (UI Library): React + Shadcn/UI + Tailwind CSS (Shadcn/UI 强依赖)。
AI 服务调用: 在后端 API 路由中使用原生的 fetch API 或 axios 库来请求 OpenRouter API。
状态管理 (State Management): 对于此项目规模，React 内置的 Hooks (useState, useEffect, useContext) 完全足够。
本地存储: 直接使用浏览器提供的 window.localStorage API。
5. 开发步骤建议 (Development Steps)
第一步：项目初始化与环境设置
使用 create-next-app 初始化一个新的 Next.js 项目。
按照 Shadcn/UI 官方文档，将其集成到你的项目中。
创建 .env.local 文件，并在其中添加 OPENROUTER_API_KEY='sk-or-v1-...'。切记将此文件加入 .gitignore，防止密钥泄露！
第二步：构建静态 UI 界面
使用 Shadcn/UI 的 Resizable 组件搭建出三栏布局。
用静态的假数据填充笔记列表和编辑器，确保界面美观，符合苹果风格。
第三步：实现核心笔记功能 (无 AI)
实现笔记的创建、删除、切换查看功能。
使用 useState 管理当前笔记状态，使用 useEffect 将笔记数组的变化同步到 localStorage 中。
第四步：创建后端 AI 代理接口
在 app/api/ai/route.js 中创建 API 路由。
编写基础逻辑，使其能接收前端请求，并能从 process.env 读取到你的 API 密钥。
先用一个固定的 Prompt 和文本，测试是否能成功调用 OpenRouter API 并返回结果。
第五步：端到端集成第一个 AI 功能
从“自动生成标题”开始，因为它最简单。
在前端，为“生成标题”按钮添加点击事件。
该事件会调用后端的 /api/ai 接口，并将笔记内容和 action: 'generate_title' 作为参数。
在后端，根据 action 构建对应的 Prompt。
将后端返回的标题更新到前端状态中。
第六步：完善所有 AI 功能与细节
重复第五步，实现“润色”和“自动生成标签”功能。
为 AI 请求添加加载状态（Loading State），例如在请求期间让按钮不可点击并显示一个加载图标。
处理可能的 API 错误（例如网络问题、额度用完等），并给用户友好提示。
第七步：整体打磨与优化
调整 CSS 和布局，使其更接近苹果官网的细节质感。
添加一些简单的 framer-motion 动画，让界面切换更流畅。
进行代码重构和清理，确保项目整洁。