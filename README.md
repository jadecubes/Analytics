# Analytics 🧮

[![npm version](https://img.shields.io/npm/v/@jadecubes/analytics.svg)](https://www.npmjs.com/package/@jadecubes/analytics)  
[![Build Status](https://img.shields.io/github/actions/workflow/status/jadecubes/Analytics/ci.yml)](https://github.com/jadecubes/Analytics/actions)  
[![License](https://img.shields.io/npm/l/@jadecubes/analytics.svg)](LICENSE)

> A unified TypeScript library for tracking analytics across **Google Analytics 4**, **Meta (Facebook) Pixel**, and **TikTok Pixel**, built for React applications and beyond.

---

## 🎯 Why Analytics?

Modern front-ends often require multiple analytics platforms. Analytics offers:
- A **single API** that works across GA4, Meta Pixel, and TikTok Pixel.
- **Lazy loading** of tracking scripts and automatic queueing of events.
- Built with **TypeScript**, offering type definitions out of the box.
- Designed for **React** (hooks + context) but easy to adapt.
- Built in an **Nx monorepo** for reuse across apps.

---

## 🧑‍💻 Who Should Use It?

- Front-end engineers using React who want to track events across multiple analytics platforms.
- Teams managing **monorepos** (e.g., Nx, Turborepo) and looking for a shared analytics lib.
- Developers who want a lightweight, configurable alternative to multiple SDKs.

---

## 🚀 Getting Started

### Install

```bash
# npm
npm install @jadecubes/analytics

# or with pnpm / yarn
pnpm add @jadecubes/analytics
