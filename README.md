<p align="center">
  <img src=".github/assets/logo.svg" alt="Analytics Logo" />
</p>

<p align="center">

[![npm version](https://img.shields.io/npm/v/@jadecubes/analytics.svg)](https://www.npmjs.com/package/@jadecubes/analytics)
[![npm downloads](https://img.shields.io/npm/dm/@jadecubes/analytics.svg)](https://www.npmjs.com/package/@jadecubes/analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)

</p>

<p align="center">
  <b>A unified TypeScript library for tracking analytics across Google Analytics 4, Meta (Facebook) Pixel, and TikTok Pixel</b>
</p>

<p align="center">
  Built for React applications and beyond
</p>

---

## 🎯 Why Analytics?

Modern front-ends often require multiple analytics platforms. Analytics offers:
- A **single API** that works across GA4, Meta Pixel, and TikTok Pixel.
- **Lazy loading** of tracking scripts and automatic queueing of events.
- Built with **TypeScript**, offering type definitions out of the box.
- Designed for **React** (hooks + context) but easy to adapt.
- Built with **Vite** for optimal bundle size and performance.

---

## 🧑‍💻 Who Should Use It?

- Front-end engineers using React who want to track events across multiple analytics platforms.
- Teams looking for a shared analytics library with a consistent API.
- Developers who want a lightweight, configurable alternative to multiple SDKs.

---

## 🚀 Getting Started

### Install

```bash
# npm
npm install @jadecubes/analytics

# or with pnpm / yarn
pnpm add @jadecubes/analytics
yarn add @jadecubes/analytics
```

---

## 📦 Publishing to npm

This library is published as `@jadecubes/analytics` on npm. If you're a maintainer, follow these steps to publish a new version:

### Prerequisites

1. **npm Account**: Ensure you have an npm account and are logged in
   ```bash
   npm login
   ```

2. **Organization Access**: You need publish access to the `@jadecubes` organization on npm

### Publishing Steps

1. **Update Version**: Update the version in `libs/analytics/package.json` following [semantic versioning](https://semver.org/):
   - **Patch** (0.0.x): Bug fixes
   - **Minor** (0.x.0): New features, backward compatible
   - **Major** (x.0.0): Breaking changes

   ```bash
   # Edit libs/analytics/package.json and update the version field
   # For example: "version": "0.0.2"
   ```

2. **Build the Library**:
   ```bash
   pnpm build
   ```

3. **Test the Build**: Verify the build output in `dist/libs/analytics/`
   ```bash
   ls -la dist/libs/analytics/
   ```

4. **Copy package.json to dist**: The package.json needs to be in the dist directory
   ```bash
   cp libs/analytics/package.json dist/libs/analytics/
   ```

5. **Publish to npm**:
   ```bash
   cd dist/libs/analytics
   npm publish --access public
   ```

### Automated Publishing (Recommended)

You can add a publish script to your root `package.json`:

```json
{
  "scripts": {
    "publish:analytics": "pnpm build && cp libs/analytics/package.json dist/libs/analytics/ && cd dist/libs/analytics && npm publish --access public"
  }
}
```

Then simply run:
```bash
pnpm publish:analytics
```

### Publishing Beta/Alpha Versions

For pre-release versions:

```bash
# Update version to include tag, e.g., "0.1.0-beta.1"
cd dist/libs/analytics
npm publish --access public --tag beta
```

---

## 🛠️ Development

### Project Structure

```
Analytics/
├── libs/
│   └── analytics/          # Main analytics library
│       ├── src/
│       │   ├── core/       # Core analytics implementations
│       │   ├── react/      # React-specific providers
│       │   └── types/      # TypeScript types
│       └── vite.config.ts  # Vite build configuration
├── docs/                   # Documentation (Storybook)
└── tools/                  # Build and development tools
```

### Available Scripts

```bash
# Build the library
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Run Storybook for documentation
pnpm storybook

# Build Storybook
pnpm build-storybook
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details
