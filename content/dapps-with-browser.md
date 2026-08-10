---
title: Dapps in Browser
order: 13
summary: Last resort — export one key into a clean browser wallet
---

Use this only when you **cannot** drive the interaction from the CLI — i.e. the dapp is hard or impossible without connecting a wallet to its frontend. Prefer [tail calls](./tail-calls.html) or [transact-raw](./transact-raw.html) whenever you can build the calldata yourself. See [Using Dapps](./dapps.html) for the full preference order.

## Flow

1. [Unshield](./unshield.html) to a fresh address (`--next`)
2. Export **only that account’s** key:

```bash
kohaku export-private-key --address 0xYourFreshAddress
```

3. Install / open a browser wallet such as [Ambire](https://www.ambire.com/) in a **clean profile** — no other seed, no other imported accounts, no shared history with your daily wallet
4. Import the exported private key into that clean extension
5. Use the dapp(s) you need. Prefer a VPN or Tor where possible, and treat the dapp website as potentially adversarial to your privacy
6. When finished, **remove the account / key** from the extension (and close the profile if you created one just for this)

> **Note:** `export-private-key` prints raw key material. Treat the terminal like a safe: no screenshots, no paste into random sites, no leaving it in scrollback on a shared machine.

## Why a clean extension matters

Browser wallets often reuse one seed and many accounts. If you import a freshly unshielded key next to your doxed daily accounts, you risk linking them through extension sync, UI mistakes, or simply using the wrong account on a dapp.

One key, one clean wallet, then delete it when done.

## Privacy while using the dapp

Every approval, swap, mint, and transfer on that address builds a public graph. The more you do from the same post-unshield account, the easier it is to characterize “who this is.” Prefer short, purposeful sessions — then stop.

If you need another private chapter later: shield again from a fresh receive address, wait, unshield to a **new** fresh address, repeat.
