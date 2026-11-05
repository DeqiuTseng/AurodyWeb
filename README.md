# AurodyWeb

Aurody official website, maintained as the `AurodyWeb/` submodule of WebMusic.

Four static pages: product (`index.html`), support (`support.html`), privacy (`privacy.html`), third-party components (`sdklist.html`). Desktop presentation is the primary experience; phone browsers receive a responsive single-column layout. All four pages support English, Simplified Chinese and Traditional Chinese. There are no download entries, release-status labels, analytics, advertising or forms.

## Preview and check

No package installation or runtime backend is required. From this repository:

```sh
node scripts/build-site.mjs
node scripts/check-site.mjs
python3 -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/`. For project-path checks, serve the parent repository and open `/AurodyWeb/` instead. The build helper renders English HTML fallback from the shared copy; edit `assets/content.mjs` and the templates in `scripts/build-site.mjs`, then rebuild. Layout is in `assets/site.css`; browser localization is in `assets/site.mjs`.

Use `?lang=en`, `?lang=zh-Hans` or `?lang=zh-Hant` for shareable language selection. Precedence: valid explicit URL selection, saved manual choice, supported browser language, English. Manual choice uses only `aurody.website.language` in localStorage; links and the current URL also preserve it if storage is unavailable. This setting is independent of the App and local Wi-Fi-transfer page. Without JavaScript all content remains readable in English and ordinary links work.

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

## Content upkeep

Public email: `deqiutseng@gmail.com`. Policy and component text reflects the source review dated November 5, 2026. Recheck native dependency locks, permissions, network and backup behavior when the App changes; review all three languages together. Hosting requests are handled by GitHub, and external audio sources are contacted only through the App behavior explained in the policy. Do not equate a local music library with an absolute promise of no external processing.
