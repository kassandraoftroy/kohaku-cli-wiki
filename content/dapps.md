---
title: Using Dapps
order: 9
summary: Interact with dapps from a clean browser wallet
---

The CLI is best for **receive → shield → wait → unshield**. Complex dapps (DEX UIs, lending, NFTs, etc.) are usually easier in a browser — but you should not dump an unshielded key into a messy, long-lived extension wallet.

## Recommended flow

1. [Unshield](./unshield.html) to a fresh address (`--next`)
2. Export **only that account’s** key:

```bash
kohaku export-private-key --address 0xYourFreshAddress
```

3. Install / open a browser wallet such as [Ambire](https://www.ambire.com/) in a **clean profile** — no other seed, no other imported accounts, no shared history with your daily wallet
4. Import the exported private key into that clean extension
5. Use the dapp(s) you need
6. When finished, **remove the account / key** from the extension (and close the profile if you created one just for this)

> **IMPORTANT:** `export-private-key` prints raw key material. Treat the terminal like a safe: no screenshots, no paste into random sites, no leaving it in scrollback on a shared machine.

## Why a clean extension matters

Browser wallets often reuse one seed and many accounts. If you import a freshly unshielded key next to your doxed daily accounts, you risk linking them through extension sync, UI mistakes, or simply using the wrong account on a dapp.

One key, one clean wallet, then delete it when done.

## Privacy while using the dapp

Every approval, swap, mint, and transfer on that address builds a public graph. The more you do from the same post-unshield account, the easier it is to characterize “who this is.” Prefer short, purposeful sessions — then stop.

If you need another private chapter later: shield again from a fresh receive address, wait, unshield to a **new** fresh address, repeat.

## Raw contract calls (no browser)

If you can get the **full dapp calldata** yourself (target, payload, optional `msg.value`), you do not need the browser path — drive the interaction from the CLI with `transact-raw`:

```bash
kohaku transact-raw --from 0xYourAddress \
  --targets 0xContract \
  --payloads 0xCalldata
```

Dry-run first, then add `--broadcast` to submit. Multiple calls are supported (matching `--targets` / `--payloads` / optional `--values` lists).

For an unshield that immediately hits a router or contract, prefer [tail calls](./tail-calls.html) instead of unshielding and then calling separately.
