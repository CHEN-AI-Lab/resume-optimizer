import { useTranslations } from "next-intl";
import Nav from "@/components/nav";
import Link from "next/link";

export default function PrivacyPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">隐私政策 / Privacy Policy</h1>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-800">1. 信息收集</p>
            <p>我们只收集你上传的简历内容用于 AI 分析。分析完成后，简历内容不会长期存储在我们的服务器上。</p>
            <p className="font-semibold text-gray-800">2. 数据使用</p>
            <p>你的简历数据仅用于生成 AI 优化建议。我们不会将你的简历数据用于训练 AI 模型或分享给第三方。</p>
            <p className="font-semibold text-gray-800">3. 支付信息</p>
            <p>所有支付通过 Creem 安全处理，我们不会存储你的银行卡信息。</p>
            <p className="font-semibold text-gray-800">4. 联系方式</p>
            <p>如有任何隐私相关问题，请通过 GitHub Issues 联系我们。</p>
            <p className="font-semibold text-gray-800">1. Data Collection</p>
            <p>We only collect your uploaded resume content for AI analysis. Resume content is not stored long-term on our servers after analysis.</p>
            <p className="font-semibold text-gray-800">2. Data Usage</p>
            <p>Your resume data is used solely for generating AI-powered optimization suggestions. We do not use your data for AI model training or share with third parties.</p>
            <p className="font-semibold text-gray-800">3. Payment</p>
            <p>All payments are securely processed by Creem. We do not store your payment card information.</p>
            <p className="font-semibold text-gray-800">4. Contact</p>
            <p>For any privacy-related questions, please contact us via GitHub Issues.</p>
          </div>
        </div>
      </main>
    </div>
  );
}