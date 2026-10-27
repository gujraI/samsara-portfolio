/**
 * Regenerates src/assets/portrait.png — the dithered head used by the neofetch
 * block on /portfolio.
 *
 *   bun add -d sharp          # only needed to regenerate the asset
 *   bun scripts/portrait.mjs --src=portrait.webp
 *
 * The source photo is deliberately NOT committed (this repo is public), so pass
 * its path with --src.
 *
 * How it works:
 *   1. crop, then resize to size x size, then unsharp-mask it — downscaling is
 *      what makes a photo look mushy at this scale, so the sharpen happens
 *      before quantisation, not after
 *   2. derive a palette from the photo with k-means (no hand-picked colours)
 *   3. Floyd–Steinberg error diffusion toward the nearest palette entry, with
 *      the error *damped* — full strength reads as noise ("ditherry"), 0.3
 *      keeps the stepped terminal banding but settles the grain
 *   4. write an RGB PNG; the page scales it by an integer factor with
 *      `image-rendering: pixelated`, so the blocks stay crisp
 *
 * History: a grayscale ASCII ramp at ~32 columns was tried first and did not
 * preserve enough of a face — hair dominated, glasses and beard dissolved.
 * Colour plus a higher pixel count is what makes it read.
 *
 * Knobs:
 *   --crop=x0,y0,x1,y1   fractions of the source (default 0.06,0.02,0.94,0.90)
 *   --size=120           output pixels per side (120 → 360px at 3x)
 *   --colors=12          palette size; lower is more graphic, higher is softer
 *   --dither=0.3         error-diffusion strength, 0 = no dither
 *   --sharpen=1.2        unsharp sigma, 0 = off
 *   --preview=path.png   nearest-neighbour upscale for eyeballing the result
 */
import sharp from "sharp";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const src = args.src ?? "portrait.webp";
const out = args.out ?? "src/assets/portrait.png";
const size = Number(args.size ?? 120);
const nColors = Number(args.colors ?? 12);
const dither = Number(args.dither ?? 0.3);
const sharpen = Number(args.sharpen ?? 1.2);
const cropArg = args.crop ?? "0.06,0.02,0.94,0.90";

const meta = await sharp(src).metadata();

let pipeline = sharp(src);
if (cropArg) {
  const [x0, y0, x1, y1] = String(cropArg).split(",").map(Number);
  pipeline = pipeline.extract({
    left: Math.round(x0 * meta.width),
    top: Math.round(y0 * meta.height),
    width: Math.round((x1 - x0) * meta.width),
    height: Math.round((y1 - y0) * meta.height),
  });
}

let resized = pipeline
  .resize(size, size, { fit: "cover", position: "center" })
  .removeAlpha();

if (sharpen > 0) resized = resized.sharpen({ sigma: sharpen });

const { data } = await resized.raw().toBuffer({ resolveWithObject: true });

const px = [];
for (let i = 0; i < data.length; i += 3) {
  px.push([data[i], data[i + 1], data[i + 2]]);
}

// k-means from evenly-spaced seeds: the palette comes from the photo itself
let centers = Array.from({ length: nColors }, (_, k) => [
  ...px[Math.floor(((k + 0.5) / nColors) * px.length)],
]);

const dist = (a, b) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

for (let iter = 0; iter < 12; iter++) {
  const sums = Array.from({ length: nColors }, () => [0, 0, 0, 0]);
  for (const p of px) {
    let best = 0;
    let bestD = Infinity;
    for (let c = 0; c < nColors; c++) {
      const d = dist(p, centers[c]);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    sums[best][0] += p[0];
    sums[best][1] += p[1];
    sums[best][2] += p[2];
    sums[best][3] += 1;
  }
  centers = centers.map((c, i) =>
    sums[i][3]
      ? [
          sums[i][0] / sums[i][3],
          sums[i][1] / sums[i][3],
          sums[i][2] / sums[i][3],
        ]
      : c,
  );
}

const nearest = (p) => {
  let best = 0;
  let bestD = Infinity;
  for (let c = 0; c < centers.length; c++) {
    const d = dist(p, centers[c]);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
};

const buf = px.map((p) => [...p]);
const idx = new Uint8Array(size * size);

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const p = buf[i];
    const c = nearest(p);
    idx[i] = c;
    const err = [
      p[0] - centers[c][0],
      p[1] - centers[c][1],
      p[2] - centers[c][2],
    ];
    const spread = (dx, dy, w) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny >= size) return;
      const j = ny * size + nx;
      buf[j][0] += err[0] * w;
      buf[j][1] += err[1] * w;
      buf[j][2] += err[2] * w;
    };
    spread(1, 0, (7 / 16) * dither);
    spread(-1, 1, (3 / 16) * dither);
    spread(0, 1, (5 / 16) * dither);
    spread(1, 1, (1 / 16) * dither);
  }
}

const rgb = Buffer.alloc(size * size * 3);
for (let i = 0; i < idx.length; i++) {
  const [r, g, b] = centers[idx[i]].map((v) =>
    Math.max(0, Math.min(255, Math.round(v))),
  );
  rgb[i * 3] = r;
  rgb[i * 3 + 1] = g;
  rgb[i * 3 + 2] = b;
}

await sharp(rgb, { raw: { width: size, height: size, channels: 3 } })
  .png()
  .toFile(out);

if (args.preview) {
  await sharp(out)
    .resize(size * 6, size * 6, { kernel: "nearest" })
    .png()
    .toFile(args.preview);
}

process.stderr.write(
  `wrote ${out} (${size}x${size}, ${nColors} colours, dither ${dither}, sharpen ${sharpen})\n`,
);
