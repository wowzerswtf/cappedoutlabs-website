/**
 * Generate the playbook PDF and write it to public/
 * Run: npx tsx scripts/generate-playbook.ts
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import { renderPlaybookPDF } from "../src/lib/playbook-pdf";

async function main() {
  console.log("Generating playbook PDF...");
  const buffer = await renderPlaybookPDF();
  const outPath = resolve("public", "ai-revenue-infrastructure-playbook.pdf");
  writeFileSync(outPath, buffer);
  console.log(`Written to ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("Failed to generate playbook:", err);
  process.exit(1);
});
