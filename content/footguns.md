---
title: Common Privacy Footguns
order: 15
summary: Easy mistakes that undo wallet privacy
---

A short list of ways people accidentally deanonymize themselves. Skim it once; re-read when something feels “convenient.”

## On-chain habits

- **Reusing deposit addresses** — every payer and every deposit becomes one cluster, trivially linked
- **Unshielding immediately** — timing + amount patterns get easier to guess
- **Unshielding back to the same address you deposited from** — defeats the point.
- **Unshielding to a used address with deanonymizing links** - if you don't unshield to a fresh address then it is important to understand that the links this receiving address has can leave clues to the identity of the unshielder
- **Transferring between your own “anonymous” accounts** — permanent public link. Be extremely careful, if you need to consolidate "dust" funds, don't do this naively [see here](./dust.html)
- **One long-lived address for “all private DeFi”** — a biography in transaction form

## Tooling & metadata

- **Remote RPC endpoint** — the provider sees which addresses and state you query, and any txs you submit to the standard mempool; prefer a local node for true privacy ([Set Env](./env.html))
- **Unshielding from your home IP** — paymaster / bundler metadata; use Tor or VPN for that step ([Unshield Funds](./unshield.html))
- **Importing an unlinked EOA key into a daily browser wallet** — now you link the existing browser wallet activity to this key ([Dapps in Browser](./dapps-with-browser.html))
- **Leaving exported keys or seed phrase in terminal scrollback or screenshots** - Just be careful whenever exporting private keys or revealing the seed - close that terminal session when you're done and get the sensitive material off your copy clipboard.

## Operational

- **Same seed on mainnet and testnet** — overlapping address derivation can fingerprint you ([Create Wallet](./create.html))
- **Weak or reused wallet password** — encryption on disk only helps if the password holds
- **Skipping dry-runs** — always run shield / unshield / transfer without `--broadcast` first when unsure

Privacy is mostly discipline: fresh receives, Tornado for the real balance, patience while shielded, short public chapters afterward.
