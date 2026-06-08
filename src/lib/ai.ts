const AI_API_KEY = process.env.OPENAI_API_KEY || "";
const AI_BASE_URL = process.env.OPENAI_BASE_URL || "https://token.sensenova.cn/v1";
const AI_MODEL = process.env.OPENAI_MODEL || "sensenova-6.7-flash-lite";

export interface ResumeAnalysisResult {
  score: number;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
  improvedHtml: string;
}

export async function analyzeResume(
  text: string,
  jobDescription?: string
): Promise<ResumeAnalysisResult> {
  const systemPrompt = `你是资深简历优化专家和 HR 招聘专家。分析用户提供的简历内容，输出 JSON 格式结果：

{
  "score": 0-100 的总体评分 (基于内容完整度、表达质量、量化成果、关键词覆盖),
  "atsScore": 0-100 的 ATS 筛选通过率评分,
  "keywords": ["提取的关键词(中英文混杂, 如: Python, 项目管理, 数据分析)"],
  "suggestions": ["每条优化建议(具体、可操作, 3-5 条)"],
  "improvedHtml": "优化后的简历HTML(纯HTML片段, 包含<style>标签, 用div.resume-preview, 整洁排版, 保留原内容精华但优化表达)"
}

规则：
1. score 和 atsScore 必须是 0-100 的整数
2. keywords 提取简历中的技能、技术栈、行业术语
3. suggestions 具体、可操作，指出哪里可以改进
4. improvedHtml 是完整可渲染的 HTML 片段
5. 如果用户提供了职位描述(jobDescription)，分析时重点匹配该职位的需求关键词`;

  const userPrompt = jobDescription
    ? `简历内容：\n${text}\n\n目标职位描述：\n${jobDescription}\n\n请根据目标职位要求优化简历。`
    : `简历内容：\n${text}\n\n请给出全面的分析和优化建议。`;

  const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned empty response");

  const result = JSON.parse(content) as ResumeAnalysisResult;

  // Validate and sanitize
  return {
    score: Math.min(100, Math.max(0, result.score || 0)),
    atsScore: Math.min(100, Math.max(0, result.atsScore || 0)),
    keywords: result.keywords?.slice(0, 20) || [],
    suggestions: result.suggestions?.slice(0, 8) || [],
    improvedHtml:
      result.improvedHtml || "<p>AI 优化完成，请升级专业版查看完整结果。</p>",
  };
}