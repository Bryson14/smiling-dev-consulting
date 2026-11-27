---
slug: mound-power-platform
title: Mound Power Platform
description: A ground-up rebuild of a baseball pitching analytics platform. A Flutter app connects to a Bluetooth pressure-sensing pitching plate, pairs its data with video, and syncs to a Supabase backend, with a staff admin dashboard and a hardware simulator for development.
status: In-Progress
updateDate: 2026-11-26
keywords:
  - sports-technology
  - hardware-integration
  - bluetooth-low-energy
  - flutter
  - mobile-app
  - platform-rewrite
  - app-store
  - baseball
technologies:
  - Flutter
  - Dart
  - Supabase
  - PostgreSQL
  - SvelteKit
  - Netlify
  - Rust
  - Bluetooth Low Energy
  - Sentry
  - PostHog
image: ../images/mound-power-logo.png
featured: true
websiteLink: https://moundpower.com
---

## Project Overview

Mound Power helps pitchers understand what their delivery is doing. A pressure-sensing pitching plate streams force data over Bluetooth to a phone, where it is paired with video of each pitch. Coaches and players get a clear picture of force, drive, and power, pitch by pitch.

This is a rebuild. The original product began in 2021 as a student startup, and its iPad-only app was a proof of concept: it showed that the idea worked, but it was never built to run a real program. Its prototype relied on demo accounts that could never reach real users.

Turning that prototype into a product meant rebuilding the foundation rather than adding features to it. The new platform needed:

- **Real infrastructure:** a managed backend with a database, storage, and migrations the team can version and test
- **Entitlements:** tiered access that controls which features each account can use
- **Proper authentication:** email and Google sign-in, with session handling that works offline
- **Bluetooth recovery:** a connection that reconnects cleanly after a drop, instead of requiring the app to be restarted
- **Persistence:** pitches saved locally first and synced in the background, so no data is lost
- **Team and player management:** coaches organize rosters, teams, and athletes in one place
- **Personalization:** profiles, avatars, and settings that make the app feel like each athlete's own

The result is a platform rather than a demo, with a staff admin dashboard and a hardware simulator that lets the whole team build without a physical plate on the bench.

## Built From the Data Up

The rebuild started with the pitches. Eighty-two real recordings from physical plates, captured between 2021 and 2026, became a regression suite. The new system has to reproduce the metrics those pitches produced, and the same recordings replay through the simulator, so development runs on realistic data from day one.

## Choosing Flutter

Before committing to a framework, the team ran a head-to-head spike of React Native and Flutter, streaming sensor data over Bluetooth at 1,000 samples per second. Both delivered the same throughput. The deciding factor was reliability: Flutter built quickly and ran cleanly, while the React Native attempt needed patching for the latest iOS release and more toolchain work. For a small team shipping a hardware product, that predictability mattered most.

## Technical Architecture

### Mobile App

A single Flutter codebase serves iOS and Android, with layouts for iPad as well as phones.

- **Riverpod** for state and dependency injection
- **go_router** for navigation that follows the user's auth state
- **flutter_blue_plus** for connecting to the plate and receiving its stream
- **camera** for capturing video alongside each pitch
- **Sentry** and **PostHog** for error reporting and product analytics, both on fixed, shared event taxonomies

The app is offline-first. Pitches are saved to a local database the moment they are recorded, then sync to the cloud in the background once a connection is available. Nothing is lost on a dropped signal, and users are asked before any unsynced data could be discarded.

Each pitch captures the settings of the device that recorded it, so a later recalibration never rewrites history.

### Backend

The backend is Supabase on PostgreSQL. There is no separate application server to run. Access rules are enforced in the database with row-level security, so each user sees only their own data no matter which client asks.

- **Schema and access rules** are version-controlled migrations, verified by a pgTAP test suite
- **Sensor data** is stored as compact binary blobs in object storage, while the database keeps only summary statistics per pitch
- **Account deletion** is built in, so users can remove their data directly from the app

Tests run against a local copy of the full stack, with real Postgres, real row-level security, and real migrations. Lightweight fakes cover fast UI iteration, but the database-backed tests are the ones that decide whether a change is correct.

### Admin Dashboard

A read-only internal dashboard, built with SvelteKit and deployed on Netlify, gives staff a view across users, players, and pitches. Access requires a staff role. The database connection is configured so that the dashboard cannot write, which keeps support work safe by construction.

### Mound Simulator

A Rust command-line tool acts as a Bluetooth peripheral that behaves like a real plate. It supports single-pitch, continuous, zone-based, and replay modes, so developers can test the full recording flow, including replays of real pitches, without hardware. BLE does not run in the iOS Simulator, so development is tested on a physical iPhone.

## App Store Readiness

Shipping to the App Store takes more than a working build. Work completed so far includes an iOS privacy manifest, Android release signing, a branded launch screen, Bluetooth and camera permissions on Android, and in-app account deletion. The remaining steps are the iOS permission descriptions, store listing assets for both platforms, Apple app registration and provisioning, and an internal TestFlight release.

The app has not yet been submitted for App Store review.

## Engineering Practices

- **Tests before code.** Every feature begins with a failing test.
- **One design system.** Colors, spacing, and type come from shared tokens, and CI enforces it.
- **Real-database testing.** Correctness is checked against real Postgres and real access rules, not mocks.

## Results and Status

Mound Power is an in-progress product with its core working end to end: Bluetooth capture, offline-first storage, video, a staff dashboard, and a simulator that lets the team build anywhere. What remains is the final App Store push, which is planned and under way.
