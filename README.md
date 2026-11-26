# AurodyWeb

Aurody official website, maintained as the `AurodyWeb/` submodule of WebMusic.

Four static pages: product (`index.html`), support (`support.html`), privacy (`privacy.html`), third-party components (`sdklist.html`). Desktop presentation is the primary experience; phone browsers receive a responsive single-column layout. All four pages support English, Simplified Chinese, Traditional Chinese, Spanish, Hindi, Arabic, French, Bangla and Portuguese. Arabic uses a right-to-left layout. The product page links to [Aurody on the China mainland App Store](https://apps.apple.com/cn/app/aurody/id6829440466). The site has no Android download entry, analytics, advertising or forms.

## Preview and check

No package installation or runtime backend is required. From this repository:

```sh
node scripts/build-site.mjs
node scripts/check-site.mjs
python3 -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/`. For project-path checks, serve the parent repository and open `/AurodyWeb/` instead. The build helper renders English HTML fallback from the shared copy; edit `assets/content.mjs` and the templates in `scripts/build-site.mjs`, then rebuild. Layout is in `assets/site.css`; browser localization is in `assets/site.mjs`.

Use `?lang=<locale>` for shareable language selection, for example `?lang=zh-Hans`, `?lang=ar` or `?lang=pt`. Supported languages and direction are listed in `assets/languages.mjs`. New locale dictionaries are in `assets/locales/`. Precedence: valid explicit URL selection, saved manual choice, supported browser language, English. Manual choice uses only `aurody.website.language` in localStorage; links and the current URL also preserve it if storage is unavailable. This setting is independent of the App and local Wi-Fi-transfer page. Without JavaScript all content remains readable in English and ordinary links work.

Assets and their source hashes/crops are recorded in [assets/SOURCES.md](assets/SOURCES.md). Images are actual App evidence with demo data, not an interactive website player. All fonts, CSS, scripts and images are local/system resources.

Privacy and SDK pages follow the user's pet reference: white document backgrounds, formal policy chapters, and platform-grouped SDK entries with provider, purpose, usage, sharing mode, information processed, client, version and official links. Copy is in `assets/legal-content.mjs` and merged into the shared language dictionary. The reference's Baidu analytics and unrelated advertising/Flutter data collection are not included.

## GitHub Pages

Planned default URL: https://deqiutseng.github.io/AurodyWeb/ . This is a deployment target, not a claim that the site is live.

After the website commit has been reviewed and pushing is authorized:

1. Push this submodule's website commit to its default branch (`main`).
2. In `DeqiuTseng/AurodyWeb` → Settings → Pages, choose **Deploy from a branch**, **main**, **/(root)**, then Save. Keep `.nojekyll`; no custom domain or `CNAME` is needed.
3. Wait for the Pages deployment to succeed. Verify the returned URL, all four HTML entry points, local assets, language switching and navigation under `/AurodyWeb/`.
4. Record the submodule SHA and deployment result in the main repository's `OpenSpec/changes/aurody-official-website/`, then update the parent gitlink with the committed submodule revision.

[GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Source preparation, local acceptance, local commit, push and live deployment are separate milestones. Follow the parent repository's `22` / `55` authorization rules. This website change does not update the App's policy URLs, permissions, backup settings or dependencies.

## app-ads.txt

The repository root includes `app-ads.txt` with the authorized Google seller record:

```text
google.com, pub-4348685463139053, DIRECT, f08c47fec0942fa0
```

AdMob checks the hostname-root path derived from the developer website in the app's store listing: [https://deqiutseng.github.io/app-ads.txt](https://deqiutseng.github.io/app-ads.txt). On November 24, 2026, this endpoint already returned HTTP 200 and the exact record as plain text. This is an observation of the existing root site, not a deployment from this repository.

Publishing this project repository with the current GitHub Pages settings serves its copy at `https://deqiutseng.github.io/AurodyWeb/app-ads.txt`; it does not update the hostname-root file. Maintain the root site's file separately if the publisher record changes. The static file does not load an advertising SDK or display ads. Final app verification is performed in AdMob and is separate from checking public file availability. See [Google's crawler-path documentation](https://support.google.com/admob/answer/9776740).

## Content upkeep

Public email: `deqiutseng@gmail.com`. Policy and component text reflects the source review dated November 5, 2026. Recheck native dependency locks, permissions, network and backup behavior when the App changes; review all nine languages together. Hosting requests are handled by GitHub, and external audio sources are contacted only through the App behavior explained in the policy. Do not equate a local music library with an absolute promise of no external processing.

## iOS advertising disclosure update (November 26, 2026)

The privacy policy and iOS SDK list now describe the iOS App Open integration with Google Mobile Ads 13.13.0 and UMP 3.1.0. The website itself does not load advertising SDKs. Nine-language source disclosure is maintained in `assets/advertising-copy.mjs`; Google-provided ad creative and privacy messages are separate. The native integration and verification record is maintained in the parent repository at `OpenSpec/changes/integrate-ios-app-open-ads/`. This source update is not a claim that the website or native App has been released. Update the AdMob privacy messages and App Store privacy disclosures for the shipping build before release.

November 27, 2026: the iOS disclosure now includes ATT permission, IDFA use only with authorization, denial/restriction fallback and changing permission in iOS Settings. Nine-language source updated; deployment is still separate.
