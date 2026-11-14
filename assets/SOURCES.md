# Website asset sources

Brand and App screenshots are generated from existing project assets.

- Brand: `UI设计/品牌/logo/apple-devices/AppIcon.appiconset/icon-ios-1024x1024.png`
  SHA-256: `f1c807d6a75b170d200b048c8f82a2bc56d07fb9faf4f0d2ef166df985f215f5`
  Outputs: logo-128.png, favicon.png, apple-touch-icon.png, share.png.

The homepage WebP assets use the English originals from
`UI设计/上架截图/iOS/2026-11-13/source/`: Aurody 1.0.0 (4), iPhone 17 / iOS 26.3.1, default text size. The source directory includes the simulator build information.

| Output | Source | Source SHA-256 | Crop (x, y, width, height) | Output size |
| --- | --- | --- | --- | --- |
| library.webp | en-library.png | `1ee31c07dd65fc1d8bc4128ecb3bd8ac7c26cd883c0738c9b6a5b0342de8d2c6` | (15, 195, 1176, 2321) | 640 × 1263 |
| playlists.webp | en-playlists.png | `97be1416cbaac118fc068fe4c147b1c1bbb34cfb2d104c2d0367fc166498ab9c` | (15, 204, 1176, 1521) | 640 × 828 |
| playback-detail.webp | en-player.png | `d41b2b687bec5a55f7cb8ce1a254ac339f68b8fb97c706f8d04d03227dc55c4c` | (163, 665, 880, 880) | 640 × 640 |

The screenshots use original demonstration media. The playback crop shows the app-drawn record without song or artist text. The website uses the same captures in all nine languages and localizes the alternative text.

Regenerate the screenshots from the main repository with `python3 .agents/scripts/generate-aurody-web-assets.py --screenshots-only` (requires Pillow).

## App Store download badges

Unmodified black badges from [Apple App Store Marketing Tools](https://toolbox.marketingtools.apple.com/app-store/).

- [English](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us)
- [Simplified Chinese](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/zh-cn)
- [Traditional Chinese](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/zh-tw)
- [Spanish](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/es-mx)
- [French](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/fr-fr)
- [Bangla](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/bn-in)
- [Portuguese](https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/pt-br)

Arabic and Hindi use the English badge with a localized download label because the public badge API did not return localized artwork for those languages.
