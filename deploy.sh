#!/bin/bash

# 🚀 AI个人笔记本 - Vercel部署脚本

echo "🚀 开始部署 AI个人笔记本到 Vercel..."

# 检查是否已安装Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录 Vercel:"
    vercel login
fi

# 部署项目
echo "📦 正在部署项目..."
vercel deploy --prod --yes

echo "✅ 部署完成！"
echo "📝 请记得在 Vercel 控制台配置环境变量"
echo "📖 查看 ENV_CONFIG.md 文件获取详细配置说明"