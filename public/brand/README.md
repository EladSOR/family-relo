# FamiRelo brand kit

All files in this folder are downloadable. After deploy they're also live at
`https://famirelo.com/brand/<filename>`.

## Files

### Vector (best — scales to any size)

| File | Size | Use for |
| --- | --- | --- |
| `logo-mark.svg` | 64×64 viewBox | Just the pin mark. App icons, social profiles, favicons, dark backgrounds (re-color in code) |
| `logo-full.svg` | 280×64 viewBox | Mark + "FamiRelo" wordmark. Email signatures, partner pages, embeds |

### Raster (PNG / JPG — for places that don't accept SVG)

| File | Pixel size | Use for |
| --- | --- | --- |
| **`logo-full.jpg`** | ~1600px wide | **Smallest universal download** (~16 KB). Use when a form asks for JPG/PNG under 512 KB. |
| **`logo-mark.jpg`** | 1024×1024 | Square version (~21 KB). Avatars / app icons that want JPG. |
| `logo-mark.png` | 512×512 | Social profile pictures (Twitter/X, LinkedIn, Instagram, Facebook avatar) |
| `logo-mark-1024.png` | 1024×1024 | Anywhere needing a high-res square (app store, podcast cover thumbnail) |
| `logo-full.png` | 1024×~250 | Header images, blog guest-post bios, press kits |
| `apple-touch-icon-180.png` | 180×180 | iOS home-screen shortcut (white card + centered pin) |
| `favicon-32.png` | 32×32 | Older-browser favicon fallback |
| `favicon-16.png` | 16×16 | Smallest favicon (browser tab) |

### Brand colors

| | Hex | Use |
| --- | --- | --- |
| Primary coral | `#FF5A5F` | Pin, accents, CTA buttons, "Relo" wordmark |
| Wordmark dark | `#0F172A` | "Fami" wordmark, headings |
| Background | `#FFFFFF` | Always white behind the mark |

### Typography

Wordmark uses **Plus Jakarta Sans** — already loaded in the site (Google Fonts).
Weight: `800` (extrabold). Tracking: tight (`-0.025em` ~ Tailwind `tracking-tight`).
For external use where Plus Jakarta isn't available, **Inter Bold** is the closest fallback.

### Quick instructions

- **Twitter/X profile picture:** upload `logo-mark.png` (or `logo-mark-1024.png` for sharper)
- **LinkedIn page logo:** upload `logo-mark-1024.png`
- **Email signature:** link to `https://famirelo.com/brand/logo-full.png`
- **Press / partnerships:** send the whole folder, or link to `/brand/`

## Editing the logo in code

Inside the app, never use these PNG files directly. Use the React component:

```tsx
import Logo from "@/components/brand/Logo";

<Logo />                       {/* default: mark + wordmark, size 28 */}
<Logo variant="mark" size={32} />
<Logo onDark wordmarkClassName="text-white" />
```

The component inlines the SVG, so it's sharper than a `<img>` and inherits the
site font.
