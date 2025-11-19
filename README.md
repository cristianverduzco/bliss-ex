# bliss-ex

# Bliss-Ex

Bliss-Ex is a cross-platform mobile app (iOS/Android) built with **React Native + Expo** for live voice/video rooms, virtual gifting, and a coin-based virtual economy.

This README focuses on how to **clone, install, and run** the project on **macOS, Linux, and Windows** so other engineers can get productive quickly.

---

## Tech Stack (High-Level)

**Mobile (iOS/Android)**
- React Native + Expo (TypeScript)
- LiveKit React Native (WebRTC) for voice/video
- TanStack Query (server state) + Zustand (client state)
- Reanimated + Gesture Handler for smooth UI
- Skia for custom graphics / gift animations

**Auth & Payments**
- Clerk for auth (email/phone/SMS/social)
- In-app purchases: StoreKit 2 (iOS) + Google Play Billing v5 (via `react-native-iap`)
- Stripe for off-store coin top-ups (cards + Apple/Google Pay)
- Push notifications: Expo Notifications (APNs + FCM)

**Moderation, Analytics, Infra**
- External services for: moderation, analytics (Amplitude/Mixpanel), feature flags, etc.
- Backend / infra are not required to boot the app locally, but are used for some features.

---

## 1. Prerequisites

### Common (All Platforms)

You’ll need:

- **Git**
- **Node.js** (LTS recommended, e.g. 18 or 20)
- A package manager:
  - We use **pnpm** by default, but `npm` will also work.
- A GitHub account (if you’re forking).

Check Node & package manager:

```bash
node -v
pnpm -v    # or: npm -v
