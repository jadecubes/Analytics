<p align="center">
  <img src=".github/assets/logo.svg" alt="Analytics Logo" />
</p>

<p align="center">

[![npm version](https://img.shields.io/npm/v/@jadecubes/analytics.svg)](https://www.npmjs.com/package/@jadecubes/analytics)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@jadecubes/analytics)](https://bundlephobia.com/package/@jadecubes/analytics)
[![Build Status](https://img.shields.io/github/actions/workflow/status/jadecubes/Analytics/ci.yml?branch=main)](https://github.com/jadecubes/Analytics/actions)
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

### Installation

```bash
npm install @jadecubes/analytics
# or
pnpm add @jadecubes/analytics
# or
yarn add @jadecubes/analytics
```

### Basic Usage

```typescript
import { createAnalyticsProviders, AnalyticsPlatforms } from '@jadecubes/analytics'

// Initialize analytics providers at app startup
createAnalyticsProviders({
  [AnalyticsPlatforms.GA]: {
    measurementId: 'G-XXXXXXXXXX'
  },
  [AnalyticsPlatforms.META]: {
    measurementId: 'YOUR_META_PIXEL_ID'
  },
  [AnalyticsPlatforms.TIKTOK]: {
    measurementId: 'YOUR_TIKTOK_PIXEL_ID'
  }
})
```

### Track Events

```typescript
import { getAnalyticsInstance, AnalyticsPlatforms } from '@jadecubes/analytics'

// Get analytics instance for a specific platform
const ga = getAnalyticsInstance(AnalyticsPlatforms.GA)
const meta = getAnalyticsInstance(AnalyticsPlatforms.META)
const tiktok = getAnalyticsInstance(AnalyticsPlatforms.TIKTOK)

// Track events for Google Analytics 4
ga?.processAnalyticsEvent({
  eventName: 'add_to_cart',
  eventParams: {
    currency: 'USD',
    value: 99.99,
    items: [
      {
        item_id: 'SKU_12345',
        item_name: 'Product Name',
        price: 99.99
      }
    ]
  }
})

// Track events for Meta (Facebook) Pixel
meta?.processAnalyticsEvent({
  eventName: 'AddToCart',
  eventParams: {
    content_name: 'Product Name',
    content_ids: ['SKU_12345'],
    content_type: 'product',
    value: 99.99,
    currency: 'USD'
  }
})

// Track events for TikTok Pixel
tiktok?.processAnalyticsEvent({
  eventName: 'AddToCart',
  eventParams: {
    content_id: 'SKU_12345',
    content_name: 'Product Name',
    value: 99.99,
    currency: 'USD'
  }
})
```

### Understanding Event Processing

The `processAnalyticsEvent` method:
- **Queues events** if the analytics script isn't loaded yet
- **Automatically sends queued events** once the platform is ready
- **Handles lazy loading** - you can call it immediately after initialization without worrying about script load timing

### React Integration

```typescript
import { useEffect } from 'react'
import { createAnalyticsProviders, getAnalyticsInstance, AnalyticsPlatforms } from '@jadecubes/analytics'

function App() {
  useEffect(() => {
    // Initialize on app mount
    createAnalyticsProviders({
      [AnalyticsPlatforms.GA]: { measurementId: 'G-XXXXXXXXXX' },
      [AnalyticsPlatforms.META]: { measurementId: 'YOUR_PIXEL_ID' },
      [AnalyticsPlatforms.TIKTOK]: { measurementId: 'YOUR_TIKTOK_PIXEL_ID' }
    })
  }, [])

  const handlePurchase = () => {
    const ga = getAnalyticsInstance(AnalyticsPlatforms.GA)
    const meta = getAnalyticsInstance(AnalyticsPlatforms.META)

    // Track purchase event
    ga?.processAnalyticsEvent({
      eventName: 'purchase',
      eventParams: {
        transaction_id: 'T_12345',
        value: 299.99,
        currency: 'USD',
        items: [{
          item_id: 'SKU_12345',
          item_name: 'Product Name',
          price: 299.99
        }]
      }
    })

    meta?.processAnalyticsEvent({
      eventName: 'Purchase',
      eventParams: {
        value: 299.99,
        currency: 'USD'
      }
    })
  }

  return <YourApp />
}
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
└── tools/                  # Build and development tools
```

### Available Scripts

```bash
# Build the library
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint
```
