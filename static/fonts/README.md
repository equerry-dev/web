# Self-hosted fonts

The design system (`src/routes/layout.css`, "Field Guide" direction) references these
libre (OFL) typefaces via `@font-face`. Drop the `.woff2` files **directly in this folder**
— they're served at `/fonts/*.woff2`. Until they're present the site falls back to
`system-ui` gracefully.

Subset to **latin** to keep the payload small. Variable fonts preferred.

| Expected filename                | Family          | Role            | Weights   | Source |
| -------------------------------- | --------------- | --------------- | --------- | ------ |
| `HankenGrotesk-Variable.woff2`   | Hanken Grotesk  | display / heads | 400–800   | https://github.com/google/fonts/tree/main/ofl/hankengrotesk |
| `Inter-Variable.woff2`           | Inter           | body / UI       | 400–600   | https://github.com/rsms/inter |
| `IBMPlexMono-Regular.woff2`      | IBM Plex Mono   | labels / code   | 400       | https://github.com/IBM/plex |
| `IBMPlexMono-Medium.woff2`       | IBM Plex Mono   | labels / code   | 500       | https://github.com/IBM/plex |

> No third-party / CDN fonts (project rule r-01). Self-host only.
