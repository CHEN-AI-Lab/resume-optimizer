import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load global env for local development
const envPath = resolve("/home/ubuntu/workspace/global.env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex > 0) {
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve("../../"),
  transpilePackages: ["@resume/shared"],
};

export default withNextIntl(nextConfig);
