# FiveMinder signatures

Team editor stored in GitHub and hosted on Cloudflare Pages. Open the published website to edit your own name, role, contact details and photo. Each person’s draft is saved only in their browser.

## Company versions

The selector offers FiveMinder and Vidaloops using the same full signature layout. Each company has separate browser drafts, branding, logo, website and export filename. The compact version is retired. Vidaloops assets derive from the supplied logo, using pink #FF0079, coral #FF393F and orange #FF8200; the top logo has dark lettering for the white background. A new company draft keeps the person's identity and phone numbers, and starts its email field blank.

## Profile photos

Choose a photo, save the prepared profile PNG, upload it into this repository’s `photos/` folder using the editor’s GitHub button, then return and choose **Use published photo** after Pages finishes deploying. Publishing a photo requires GitHub write access to this repository. Existing public HTTPS photo URLs also work.

Copy the formatted signature into your email client. Signatures use PNG images and HTML text, with no SVG dependency.

## Hosting

Use a private GitHub repository, as with the original Plateau signature. In Cloudflare, choose **Workers & Pages → Create application → Pages → Connect to Git**, then select the repository. Use production branch `main`, framework **None**, leave the build command empty, and set the build output directory to `/`. Cloudflare supplies the public HTTPS site address after deployment; the editor automatically uses that address for all shared PNG images and published photos.

The editor's `config.js` must name the connected GitHub repository. The prepared value is `AnthonyMuir/fiveminder`; confirm that destination before publishing. Upload these files plus the `photos/` directory to the repository root. No GitHub Pages deployment is needed.

This is a static Pages site: no paid image service, Functions, R2 bucket, or subscription is required. Cloudflare Free currently allows 500 builds per month, 20,000 files, and 25 MiB per asset. Each committed photo triggers a deployment, so stay within the build limit. Private GitHub repositories are supported by Cloudflare Pages.

References: https://developers.cloudflare.com/pages/get-started/git-integration/ and https://developers.cloudflare.com/pages/platform/limits/

The initial files contain a neutral profile and no credentials or personal contact details. PNG photos added to `photos/` become publicly accessible through Cloudflare so email recipients can load them, even when the GitHub repository is private. Publishing photos requires GitHub access, or a teammate can provide an already hosted HTTPS photo URL. Selecting a photo alone does not publish it. The signature has been checked in Chromium; actual sent email clients and the live Cloudflare deployment have not yet been tested.

Capability icons are derived from Phosphor Icons (MIT); the license is included. https://github.com/phosphor-icons/core
