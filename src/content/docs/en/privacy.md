---
title: Privacy Policy
description: Privacy Policy for Evere App
---

**Last Updated**: November 11, 2026

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

- **Project Information**: Project name, base currency, member names, settlement status
- **Payment Information**: Title, amount, currency, category, payment date, memo, split mode, split amounts/ratios, settlement status
- **Receipt Images** (optional): You can attach images as payment proof
  - Images may be optimized for storage efficiency
  - Metadata (such as location data) may be removed during processing

### 2.3 Device Information

When using push notifications, we collect:

- Expo Push Token (for notification delivery)
- Platform (iOS/Android/Web)
- Notification enabled flag

We also record when you last used the app and your device's time zone, so that reminder notifications are sent at a suitable time of day.

### 2.4 Local Cache

For offline functionality, the following information is stored locally on your device:

- Exchange rate cache (TTL: 70 minutes)
- Payment data (for offline sync)
- Authentication session

### 2.5 Receipt Scanning

When you use receipt scanning, we send the following information to Google's AI (Gemini API). The first time you use it, the app explains where the data is sent and what is sent, and asks for your consent.

- The receipt photo you take or choose (reduced in size for reading). This includes anything shown in the photo, such as the store name, items and amounts
- Category names, used to categorize the scanned expense

We do not store the photos you send or what was read on our servers. However, we do store the expenses you save (the store name, date, amount and other details, as well as the receipt items and who each item is assigned to) and photos you attach to them. Photos temporarily saved on your device are deleted when scanning is finished.

To manage the number of scans on the free plan, we record when each scan was made and its result (whether it could be read).

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

### 3.6 Receipt Scanning

- Reading the store name, date, amount and other details from receipt photos to help you enter expenses
- Splitting an expense by item, and letting you change who each item is assigned to after saving
- Managing the number of scans on the free plan

### 3.7 Usage Analytics

- Understanding how features are used to improve the service (using PostHog)

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

### 4.5 Google (Gemini API)

**Role**: Receipt scanning (AI)
**Data Shared**: Receipt photos, category names
**Purpose**: Providing receipt scanning
**How Data Is Handled**: We use the paid Gemini API. Under Google's terms, the photos and results are not used to improve Google's products or to train its AI. Google may log them for a limited period to detect abuse and for legal or regulatory purposes, and they may be processed in countries where Google has facilities.

### 4.6 ExchangeRate-API

**Role**: Exchange rate retrieval
**Data Shared**: Currency pair information
**Purpose**: Multi-currency conversion
**Access Method**: Via Supabase Edge Function (when the stored rate is out of date)

### 4.7 OAuth Authentication Providers

- **Apple**: Apple Sign In
- **Google**: Google Sign-In

### 4.8 PostHog (United States)

**Role**: Usage analytics
**Data Shared**: User ID, in-app activity (screens and features used), device type, OS and app version
**Purpose**: Service improvement

### 4.9 Chatwoot

**Role**: In-app support chat
**Data Shared**: User ID, display name, email address, message content
**Purpose**: Responding to inquiries

### 4.10 Resend (United States)

**Role**: Email delivery
**Data Shared**: Email address, email content (such as confirmation links or codes)
**Purpose**: Sending account confirmation and password reset emails

## 5. Data Storage and Deletion

### 5.1 Data Storage Locations

- **Supabase Postgres**: Profiles, projects, payment data
- **Supabase Storage**: Receipt images (access-controlled storage, accessible via time-limited URLs when applicable)
- **Local Device**: Offline cache (deleted after sync)

### 5.2 Data Retention Period

- Active users: Indefinitely while using the service
- Offline cache: Exchange rates 70 minutes, payment data deleted after sync
- Receipt scan records (time and result): Until you delete your account

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

The app does not show ads and does not use the advertising identifier (IDFA). We do not track you across other companies' apps or websites.

## 10. Changes to Privacy Policy

This Privacy Policy may be updated without notice due to legal or service changes. We will notify you via in-app notification or email for significant changes.

## 11. Contact Us

For questions about this Privacy Policy, data deletion requests, or other privacy inquiries, please contact:

**Email**: support@evereapp.com

---

This Privacy Policy is based on verified facts from the Evere app codebase.
