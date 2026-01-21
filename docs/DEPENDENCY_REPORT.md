# Dependency Version Verification Report

All dependencies are locked in `package-lock.json`. Each version below was verified against the official npm registry or release notes.

| Dependency | Version | Verification Source | Reason | Compatibility Notes |
| --- | --- | --- | --- | --- |
| three | 0.160.0 | https://www.npmjs.com/package/three/v/0.160.0 | Mature WebGL engine with high-quality PBR materials and geometry utilities. | Compatible with Vite 5 + ES modules; types supplied by @types/three. |
| katex | 0.16.9 | https://www.npmjs.com/package/katex/v/0.16.9 | Offline LaTeX rendering for formulas; no CDN needed. | Works in browser with bundled CSS import. |
| vite | 5.2.11 | https://www.npmjs.com/package/vite/v/5.2.11 | Fast dev server + bundler for modern front-end. | Compatible with ES modules and TypeScript 5.4. |
| typescript | 5.4.5 | https://www.npmjs.com/package/typescript/v/5.4.5 | Type-safe development and build checks. | Works with Vite 5 and @types/three. |
| @types/three | 0.160.0 | https://www.npmjs.com/package/@types/three/v/0.160.0 | Provides typings matching three.js 0.160.0. | Matches three.js 0.160.0 API surface. |
| @types/katex | 0.16.8 | https://www.npmjs.com/package/@types/katex/v/0.16.8 | Type definitions for KaTeX usage in TypeScript. | Aligns with KaTeX 0.16.x API. |

## Verification steps
- Used npm registry pages listed above to confirm each version exists and is published.
- Locked exact versions in `package-lock.json` to ensure reproducible installs.
