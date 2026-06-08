# Resume Optimizer — AI 简历智能优化工具

上传简历，AI 在 30 秒内分析评分、提取关键词、给出优化建议，一键导出优化版 PDF。

## 功能

- 📄 上传 PDF/DOCX 简历
- 🤖 AI 智能评分（总体评分 + ATS 通过率评分）
- 🔑 关键词提取与分析
- ✏️ 逐段优化建议
- 📥 下载优化版简历
- 🌐 中英文双语界面
- 💰 免费3次/天，升级专业版无限使用

## 技术栈

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- next-intl (国际化)
- SenseTime AI API
- Creem 支付

## 快速启动

```bash
# 安装依赖
npm install --registry=https://registry.npmmirror.com

# 启动开发服务器
npm run dev
```

## 环境变量

复制 `.env.example` 并配置：

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | AI API Key (兼容 OpenAI 格式) |
| `OPENAI_BASE_URL` | AI API 地址 |
| `OPENAI_MODEL` | 模型名称 |
| `CREEM_API_KEY` | Creem 支付 API Key |
| `CREEM_PRODUCT_ID` | Creem 产品 ID |
| `CREEM_WEBHOOK_SECRET` | Creem Webhook Secret |
| `NEXT_PUBLIC_APP_URL` | 网站 URL |

## 部署

一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 变现模式

- **免费**：每日 3 次 AI 基础分析
- **专业版 ¥19.9**：无限使用 + 完整优化 + PDF 导出（一次性付费，永久有效）