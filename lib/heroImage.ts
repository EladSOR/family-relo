/**
 * City hero: native <img> + Unsplash srcset (no next/image).
 * Steps: phone → 1080w, laptop → 1920w, large / retina → 2560w.
 * Hero is also capped at max-w-[1920px] so ultrawide monitors don’t upscale a strip.
 */
function unsplashWithSize(url: string, w: number, q: number): string {
  const u = new URL(url);
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", "max");
  u.searchParams.set("w", String(w));
  u.searchParams.set("q", String(q));
  return u.toString();
}

export function getCityHeroImgAttrs(url: string): {
  src: string;
  srcSet?: string;
  sizes: string;
} {
  if (!url.includes("images.unsplash.com")) {
    return { src: url, sizes: "100vw" };
  }
  const src1080 = unsplashWithSize(url, 1080, 82);
  const src1920 = unsplashWithSize(url, 1920, 85);
  const src2560 = unsplashWithSize(url, 2560, 88);
  return {
    src: src1920,
    srcSet: `${src1080} 1080w, ${src1920} 1920w, ${src2560} 2560w`,
    sizes:
      "(max-width: 768px) 100vw, (max-width: 1920px) min(100vw, 1920px), 1920px",
  };
}
