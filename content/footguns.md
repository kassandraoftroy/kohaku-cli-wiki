---
title: Common Privacy Footguns
order: 13
summary: Easy mistakes that undo wallet privacy
---

A short list of ways people accidentally deanonymize themselves. Skim it once; re-read when something feels “convenient.”

## On-chain habits

- **Reusing deposit addresses** — every payer and every deposit becomes one cluster
- **Shielding from a doxxed address** — Tornado hides the withdraw side, not the fact that *that* address deposited
- **Unshielding immediately** — timing + amount patterns get easier to guess
- **Unshielding back to the same address you deposited from** — defeats the point
- **Transferring between your own “anonymous” accounts** — permanent public link
- **One long-lived address for “all private DeFi”** — a biography in transaction form

## Tooling & metadata

- **Remote RPC as your only node** — the provider sees which addresses you query; prefer a local node when you can ([Set Env](./env.html))
- **Unshielding from your home IP** — paymaster / bundler metadata; use Tor or VPN for that step ([Unshield Funds](./unshield.html))
- **Importing a fresh key into a daily browser wallet** — seeds, sync, and misclicks link worlds ([Using Dapps](./dapps.html))
- **Leaving exported keys in terminal scrollback or screenshots**

## Operational

- **Same seed on mainnet and testnet** — overlapping address derivation can fingerprint you ([Create Wallet](./create.html))
- **Weak or reused wallet password** — encryption on disk only helps if the password holds
- **Skipping dry-runs** — always run shield / unshield / transfer without `--broadcast` first when unsure

Privacy is mostly discipline: fresh receives, Tornado for the real balance, patience while shielded, short public chapters afterward.
