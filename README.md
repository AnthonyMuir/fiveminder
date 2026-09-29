# FiveMinder and Vidaloops signatures

Team editor: https://fiveminder.pages.dev/

Latest 3D footer preview: https://fiveminder.pages.dev/?footer=orbit

Vidaloops editor: https://fiveminder.pages.dev/?footer=orbit&brand=vidaloops

The shared editor link always opens Sean’s default sample. Choose your company and click **Create my signature** to start a separate personal profile, enter your name, title, contact details and social links, and copy it into your email client's signature settings. Editing the sample also automatically creates a personal profile. No one’s edits or photo become the shared sample. The headline remains editable. All outgoing images use PNG; no SVG support is required.

## Profile photos

Choose **Choose photo** and select a PNG, JPEG or WebP (up to 10 MB). The editor center-crops it to a crisp 512 × 512 PNG, uploads it automatically to Cloudflare, checks that its public image URL loads, and saves that URL in your browser draft. Then click **Copy signature**. No GitHub account or manual publishing steps are needed. You can also paste an existing public HTTPS image URL.

Uploaded photos are public so email recipients can display them. Existing photo links are never overwritten; choosing a new photo does not break older emails. Upload errors retain the previous photo. Drafts and contact details remain in your browser; only the prepared photo is sent to Cloudflare. Use **Copy personal editor link** to reopen the profile on another device. Each copied link carries the profile details at that time in its URL fragment; it is not a live account sync. Keep the latest link after changing details. Anyone with it can view those details. The browser saves subsequent edits locally and updates the current personal URL; an older link cannot overwrite a newer local draft.

The upload endpoint accepts only prepared 512-pixel PNGs up to 1 MB, uses immutable content-addressed URLs, deduplicates identical images, restricts browser origins, and applies a best-effort ten-new-images-per-IP-per-hour limit. This is a public team editor, not an authenticated private media vault. KV consistency means rate counters are approximate. A 900-image capacity guard keeps this namespace below the free storage allowance; an administrator can review storage in Cloudflare if it fills up.

## Branding

FiveMinder uses the approved green logo and black capability footer. Vidaloops uses its supplied logo, pink/coral/orange palette, and “Turn your Visuals into Motion” slogan. Its latest floating portfolio includes wedding, fashion, product ads and a distant dancing card around an editable central slogan. Its static portfolio collage was adapted from the supplied gallery reference using image generation; it is illustrative artwork, not extracted video frames.

## Hosting

Source: `AnthonyMuir/fiveminder`, production branch `main`. Cloudflare Pages uses framework **None**, no build command, and output directory `/`. Commits automatically deploy the editor and shared images. The deployed HTTPS address is used automatically for email image URLs.

Static logos and artwork remain on GitHub/Cloudflare Pages. `_worker.js` handles `/api/photos` and `/profile-images/*`; `_routes.json` keeps static requests out of Functions. Bind `SIGNATURE_PHOTOS` to the isolated KV namespace `fiveminder-signature-photos` in the Pages production settings before deploying. The current account uses Workers Free; no paid image service, R2 bucket or plan upgrade is needed. Free quotas can temporarily stop uploads or image reads if exhausted. See https://developers.cloudflare.com/kv/platform/pricing/.

Deploy all runtime files through the existing GitHub integration (dashboard direct-upload does not deploy Functions). The root build output stays `/`. Do not place credentials in `config.js`; this uploader requires none in the browser.

The starter sample is prefilled with Sean Anthony Muir’s details and hosted photo. **View default sample** returns to it without erasing personal profiles. Use the **Saved signature** menu to reopen profiles saved in this browser; other browsers see only their own saved list. Older one-person drafts are preserved as saved profiles and no longer control the default view. The generic link is the one to share with the team; personal editor links are for the individual. Contact details are not stored in the server’s photo namespace. The editor has been checked in Chromium; rendering in individual email clients can vary.

Capability icons derive from Phosphor Icons under the MIT license; `LICENSE-phosphor.txt` is included. https://github.com/phosphor-icons/core
