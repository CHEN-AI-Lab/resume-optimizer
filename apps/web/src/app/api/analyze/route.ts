import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@resume/shared/api/ai";

export async function POST(request: NextRequest) {
  try {
    const { text, jobDescription } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json(
        { error: "请提供有效的简历内容（至少 50 个字符）" },
        { status: 400 }
      );
    }

    const result = await analyzeResume(text, jobDescription);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze API error:", error);
    const message =
      error instanceof Error ? error.message : "分析失败，请重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}