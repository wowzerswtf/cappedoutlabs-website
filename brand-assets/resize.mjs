import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "brand");
const src = (n) => path.join(OUT, n);

// [source@2x, output, width, height]
const JOBS = [
  ["avatar@2x.png", "avatar-512.png", 512, 512],
  ["avatar@2x.png", "avatar-400.png", 400, 400],
  ["linkedin-banner@2x.png", "linkedin-banner.png", 1128, 191],
  ["x-header@2x.png", "x-header.png", 1500, 500],
  ["logo-horizontal-dark@2x.png", "logo-horizontal-dark.png", 1200, 360],
  ["logo-horizontal-light@2x.png", "logo-horizontal-light.png", 1200, 360],
];

for (const [s, o, w, h] of JOBS) {
  await sharp(src(s)).resize(w, h, { fit: "fill" }).png({ compressionLevel: 9 }).toFile(src(o));
  console.log("resized", o, `${w}x${h}`);
}
console.log("done");
