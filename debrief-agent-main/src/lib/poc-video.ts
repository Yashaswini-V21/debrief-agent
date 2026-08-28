import pocVideoAsset from "@/assets/proof-of-work.mp4.asset.json";

// Paste your demo recording link here, then save.
// Works with:
//   - YouTube:  "https://www.youtube.com/watch?v=XXXXXXXXXXX" or a share/embed link
//   - Loom:     "https://www.loom.com/share/XXXXXXXX"
//   - MP4 file: put it in public/ and use "/my-demo.mp4"
// Leave empty ("") to show the "recording pending" placeholder.
export const POC_VIDEO_URL = pocVideoAsset.url;

export type PocEmbed =
  | { type: "none" }
  | { type: "iframe"; src: string }
  | { type: "file"; src: string };

export function resolvePocEmbed(url: string): PocEmbed {
  const raw = url.trim();
  if (!raw) return { type: "none" };

  const youtube =
    raw.match(/[?&]v=([\w-]{6,})/) ??
    raw.match(/youtu\.be\/([\w-]{6,})/) ??
    raw.match(/youtube\.com\/(?:embed|shorts)\/([\w-]{6,})/);
  if (youtube?.[1]) return { type: "iframe", src: `https://www.youtube.com/embed/${youtube[1]}` };

  const loom = raw.match(/loom\.com\/(?:share|embed)\/([\w-]+)/);
  if (loom?.[1]) return { type: "iframe", src: `https://www.loom.com/embed/${loom[1]}` };

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(raw)) return { type: "file", src: raw };

  return { type: "iframe", src: raw };
}
