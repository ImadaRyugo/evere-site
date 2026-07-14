---
title: 💱 Multiple currencies & exchange rates
description: 162 currencies, base vs. available currencies, automatic and fixed rates, unconfirmed rates, manual rates (Pro), and My currency.
sidebar:
  label: 💱 Currencies & rates
  order: 6
---

Evere supports **162 currencies**. For overseas travel or any situation where currencies get mixed, you can log and settle everything as-is.

## Base currency and available currencies

A project has two currency concepts.

- **Base currency** — the currency settlement is calculated in. Every expense is converted to it for the totals. You choose it when creating the project, and it can't be changed after the first expense.
- **Available currencies** — the currencies you can pick when entering an expense. Add or remove them anytime in project settings.

For example, if the base currency is "USD" and you add "THB" to the available currencies, any expense paid in baht is automatically converted to USD for settlement.

## How exchange rates work

When you log an expense, **the exchange rate at that moment is fetched automatically and saved.**

:::note
The rate is fixed at the moment you log. Even if the market moves later, the converted amount of an already-logged expense won't change.
:::

On the expense detail and settlement screens, you can check the applied rate and its last-updated time.

## Watch out for unconfirmed rates

If an expense has an unconfirmed rate for some reason, **that expense is temporarily excluded from the settlement calculation.** If the settlement screen shows "There are unconfirmed exchange rates," open the affected expense and confirm the rate. Left excluded, the settlement amounts won't match reality.

## Setting a manual exchange rate (Pro)

If you want to set the rate yourself, you can enter a **manual exchange rate** per expense.

:::note
Manual exchange rates are a Pro feature.
:::

## My currency (a display currency)

In the Settings tab, "My currency" lets you set a **personal display currency**. Amounts in a different currency are shown with a converted figure in your My currency.

:::note
My currency is for display only and **does not affect the settlement calculation.**
:::
