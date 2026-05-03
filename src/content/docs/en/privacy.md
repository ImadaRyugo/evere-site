---
title: Privacy Policy
description: Privacy Policy for Evere App
---

**Last Updated**: February 3, 2025

## 1. Introduction

Evere ("the Service") is a mobile application designed to help couples and groups manage bill splitting and settlements effortlessly across multiple currencies. This Privacy Policy explains what information we collect, how we use it, and how we protect it.

By using the Service, you agree to this Privacy Policy.

## 2. Information We Collect

### 2.1 Account Information

We offer the following authentication methods:

- **Anonymous Authentication (Guest Mode)**: Use the Service without registration
- **Apple Sign In**: Sign in with your Apple ID
- **Google Sign In**: Sign in with your Google Account
- **Email/Password**: Authentication with email and password
- **Account Linking**: Upgrade from anonymous account to email-based account

The following information is stored through these methods:

- User ID (UUID)
- Display name
- Accent color (UI preference)
- Pro status (paid features usage)
- Onboarding completion flag

### 2.2 Project & Payment Data

As core features, we store the following data:

- **Project Information**: Project name, base currency, participant names, settlement status
- **Payment Information**: Title, amount, currency, category, payment date, memo, split mode, split amounts/ratios, settlement status
- **Receipt Images** (optional): You can attach images as payment proof
  - Images may be optimized for storage efficiency
  - Metadata (such as location data) may be removed during processing

### 2.3 Device Information

When using push notifications, we collect:

- Expo Push Token (for notification delivery)
- Platform (iOS/Android/Web)
- Notification enabled flag

### 2.4 Local Cache

For offline functionality, the following information is stored locally on your device:

- Exchange rate cache (TTL: 70 minutes)
- Payment data (for offline sync)
- Authentication session

## 3. How We Use Information

We use collected information for the following purposes:

### 3.1 Service Provision

- Bill splitting and settlement features
- Multi-currency conversion (exchange rate retrieval)
- Project sharing and invitation
- Offline support (local caching)

### 3.2 Authentication & Access Control

- User authentication
- Project access management

### 3.3 Notifications

- Project invitation notifications
- Payment addition notifications

### 3.4 Service Improvement

- Error monitoring and crash reports (using Sentry)
- Performance monitoring
- Session replay (collection scope and sampling rates may vary depending on configuration)

### 3.5 Payment Management

- In-app purchases (Pro features)
- Subscription status synchronization

### 3.6 Advertising

- Ad delivery via Google AdMob (free version only)
- Content is suitable for all ages

## 4. Information Sharing and Third-Party Services

We use the following third-party services:

### 4.1 Supabase (United States)

**Role**: Backend infrastructure
**Data Shared**: Authentication info, project/payment data, receipt images, device tokens
**Purpose**: Core service functionality

### 4.2 Sentry (United States)

**Role**: Error monitoring and analysis
**Data Shared**: Error information, crash reports, performance data, session replays
**Purpose**: App quality improvement

### 4.3 Expo Push Notification Service (United States)

**Role**: Push notification delivery
**Data Shared**: Expo Push Token, notification content
**Purpose**: Project invitation and update notifications

### 4.4 RevenueCat (United States)

**Role**: In-app purchase management
**Data Shared**: User ID, purchase information, subscription status
**Purpose**: Pro feature provision

### 4.5 Google AdMob (United States)

**Role**: Ad delivery
**Data Shared**: Advertising identifier, ad display/click information
**Purpose**: Free version monetization

### 4.6 ExchangeRate-API

**Role**: Exchange rate retrieval
**Data Shared**: Currency pair information
**Purpose**: Multi-currency conversion
**Access Method**: Via Supabase Edge Function (once per hour)

### 4.7 OAuth Authentication Providers

- **Apple**: Apple Sign In
- **Google**: Google Sign-In

## 5. Data Storage and Deletion

### 5.1 Data Storage Locations

- **Supabase Postgres**: Profiles, projects, payment data
- **Supabase Storage**: Receipt images (access-controlled storage, accessible via time-limited URLs when applicable)
- **Local Device**: Offline cache (deleted after sync)

### 5.2 Data Retention Period

- Active users: Indefinitely while using the service
- Offline cache: Exchange rates 70 minutes, payment data deleted after sync

### 5.3 Data Deletion

- Receipt image deletion: Available from payment edit screen
- Project deletion: Available from project settings
- Account deletion: Contact [support_email]

## 6. Security

We implement the following security measures to protect your information:

- **HTTPS Communication**: All communications are encrypted
- **Row Level Security (RLS)**: Database-level access control
- **Access-Controlled Storage**: Receipt images are stored with appropriate access controls
- **Metadata Handling**: Location data and other metadata may be removed from images during processing
- **Image Optimization**: Images may be processed for storage efficiency

## 7. Your Rights

You have the following rights:

### 7.1 Access Rights

- View your data within the app

### 7.2 Correction Rights

- Edit profile and payment information

### 7.3 Deletion Rights

- Delete individual payments and receipt images
- For account deletion, contact [support_email]

### 7.4 Notification Settings

- Enable/disable push notifications
- Change settings from app settings screen

## 8. Children's Privacy

While the Service is suitable for all ages, we do not intentionally collect personal information from children under 13. If you believe your child has provided personal information, please contact [support_email].

## 9. Cookies & Tracking

### 9.1 Website

Our official website currently does not use Cookies or Analytics tools.

### 9.2 Mobile App

Google AdMob may use advertising identifiers for ad delivery. On iOS, the availability of advertising identifiers depends on the user's "Allow Apps to Request to Track" permission setting.

## 10. Changes to Privacy Policy

This Privacy Policy may be updated without notice due to legal or service changes. We will notify you via in-app notification or email for significant changes.

## 11. Contact Us

For questions about this Privacy Policy, data deletion requests, or other privacy inquiries, please contact:

**Email**: support@evereapp.com

---

This Privacy Policy is based on verified facts from the Evere app codebase.
