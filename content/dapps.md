---
title: Using Dapps
order: 10
summary: How to approach dapp interactions after an unshield
---

The CLI shines at **receive → shield → wait → unshield**. What you do *after* that — pay someone, hit a router, use a DeFi protocol — is where choices matter.

Prefer paths that never connect a wallet to a dapp frontend. Frontends see your address, can fingerprint you, and often push you into messy multi-step approvals. When you *can* build the calldata yourself, keep everything in the CLI.

## Preference order

1. **Just paying someone exact `Y`** — use [private-transfer](./private-transfer.html). It unshields through a fresh account and forwards the exact amount in one step (Tornado, Privacy Pools, and Railgun).
2. **Build custom calldata yourself** (no wallet connected to any frontend) — then, if you can, run it **in the same flow as the unshield** with [tail calls](./tail-calls.html). Fresh address appears mid-flow; funds never sit idle waiting for a second tx.
3. **Same calldata, later** — if you already unshielded (or cannot attach the call to the unshield), submit with [transact-raw](./transact-raw.html).
4. **Already on a public address** — plain [transfer](./transfer.html) from that address when you decide the destination only afterward.
5. **Last resort: browser** — only when the dapp is hard or impossible to use without connecting a wallet to its frontend. Then [export one key into a clean browser wallet](./dapps-with-browser.html), use it briefly, and remove it.

```text
paying someone exact Y from private balance?
        │
       yes ──► private-transfer
        │
        no ──► can you build calldata without a frontend?
                      │
                     yes ──► can you attach it to the unshield?
                      │              │
                      │             yes ──► tail calls
                      │              │
                      │              no ──► transact-raw after unshield
                      │
                      no ──► clean browser wallet (last resort)
```

## Why this order

- **Private transfer** is the zero-calldata path for “pay this address exactly Y.”
- **Tail calls** keep “appear as a fresh address” and “do the useful thing” atomic when you already have router / contract calldata.
- **Transact-raw** is still CLI-only and frontend-free — just not synchronized with the unshield.
- **Browser export** works for anything a UI can do, but you hand key material to an extension and trust a website that may be adversarial to privacy. Use it only when the alternatives fail.

The next pages walk each option in that order.
