---
slug: mound-power
title: Mound Power
description: A ground-up rewrite of a baseball pitching analytics app,
  originally a 2021 pre-revenue student startup. Rebuilt as a cross-platform
  React Native app with a Supabase backend, replacing demo ghost admin accounts
  with real, productionizable auth. Pairs hardware sensors and camera to measure
  and improve pitcher force, drive, and power.
status: In-Progress
updateDate: 2026-08-27
keywords:
  - mobile
  - react-native
  - sports-technology
  - platform-rewrite
  - hardware-integration
technologies:
  - react native
  - supabase
  - postgresql
  - typescript
  - sensor-integration
---
## Project Overview

Mound Power is a cross-platform sports technology application built for baseball, combining hardware sensors with software to measure and improve a pitcher's force, drive, and power. It pairs hardware sensors and camera with a mobile app to give coaches and players the best, most actionable feedback.

Originally a pre-revenue student startup from 2021, Mound Power is being fixed and remade: a ground-up rewrite of the legacy Firebase prototype and iOS UIKit iPad-only app into a modern, cross-platform React Native application with a Supabase backend—with real authentication replacing the janky demo ghost admin accounts, so it can actually be productionized.

## Background

Mound Power was originally started as a pre-revenue student startup in 2021. The original build shipped a Firebase prototype and an iOS UIKit iPad-only app, but the accounts were janky ghost admin accounts that did everything for demo purposes—never meant for real, production use.

I'm now fixing and remaking that foundation. The app is being rebuilt from the ground up as a cross-platform React Native application with a Supabase backend, replacing the demo-only auth with real, productionizable authentication and making the platform actually deployable at scale.

## Technical Architecture

### Frontend Stack

- **React Native** - Cross-platform mobile framework supporting iOS and Android
- **TypeScript** - Type-safe, maintainable application code
- **Sensor & camera pairing** - Integrated hardware and camera capture for movement and force analysis
- **Realtime feedback** - Coaching-grade metrics delivered at the point of practice

### Backend Stack

- **Supabase** - Backend-as-a-service providing authentication, database, and realtime capabilities
- **PostgreSQL** - Relational data model for athletes, sessions, and measurement history
- **Production auth** - Real user authentication replacing the legacy demo ghost admin accounts
- **Hardware integrations** - Sensor data pipelines feeding metrics for force, drive, and power

## Design & User Experience

The app is designed to be usable in practice and game settings, with a focus on delivering immediate, legible feedback to coaches and players. Measurement data is presented clearly so feedback leads directly to mechanical adjustments.

## Key Features

### Performance Tracking

- **Force, drive, and power metrics** - Core measurements of a pitcher's movement
- **Session-based tracking** - Structured capture of throws and drills over time
- **History and progression** - Long-term trend data for improvement over time

### Sensor & Camera Integration

- **Hardware sensor pairing** - Connect physical sensors to capture mechanical data
- **Camera capture** - Video alongside sensor data for a complete picture
- **Feedback loop** - Combine measurements and visuals into clear coaching guidance

## Current Status

Mound Power is an in-progress, ground-up rewrite. It fixes and remakes an original 2021 pre-revenue student startup, replacing the demo-only Firebase prototype and iOS UIKit-only app with a modern, productionizable cross-platform foundation on React Native with a Supabase backend. Real authentication replaces the old ghost admin accounts, and the goal is a platform that can actually run in production while preserving the core mission of improving pitcher force, drive, and power.