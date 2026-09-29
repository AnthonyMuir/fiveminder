# FiveMinder and Vidaloops signatures

Team editor: https://fiveminder.pages.dev/

Choose your company, enter your name, title, contact details and social links, then copy the signature into your email client's signature settings. Each company has its own browser draft. The headline remains editable. All outgoing images use PNG; no SVG support is required.

## Profile photos

Choose a photo in the editor and save the prepared profile PNG. Use the editor's GitHub button to upload it into this repository's `photos/` folder. After Cloudflare deploys the change, return to the editor and choose **Use published photo**. GitHub write access is required to upload. An existing public HTTPS photo URL also works.

Selecting a photo alone does not publish it. Photos committed here are public so email recipients can display them.

## Branding

FiveMinder uses the approved green logo and black capability footer. Vidaloops uses its supplied logo, pink/coral/orange palette, and “Turn your Visuals into Motion” slogan. Its static portfolio collage was adapted from the supplied gallery reference using image generation; it is illustrative artwork, not extracted video frames.

## Hosting

Source: `AnthonyMuir/fiveminder`, production branch `main`. Cloudflare Pages uses framework **None**, no build command, and output directory `/`. Commits automatically deploy the editor and shared images. The deployed HTTPS address is used automatically for email image URLs.

This static site uses no paid image service, Functions or R2 bucket. Hosting details: https://developers.cloudflare.com/pages/get-started/git-integration/

The starter profile contains no personal contact information. The editor has been checked in Chromium; rendering in individual email clients can vary.

Capability icons derive from Phosphor Icons under the MIT license; `LICENSE-phosphor.txt` is included. https://github.com/phosphor-icons/core
