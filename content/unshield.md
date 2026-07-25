---
title: Unshield Funds
order: 7
summary: Withdraw from Tornado to a fresh public address
---

Unshielding brings private Tornado balance back onto a public Ethereum address.

**Always unshield to a fresh address** — never back to the same address you shielded from, and preferably not to any address that already has history you care about linking.

## Unshield to a fresh address

```bash
kohaku unshield --protocol tornado --next --amount-formatted 1.0
```

`--next` creates a brand-new public account in your wallet and pays it. Dry-run first (no `--broadcast`), then:

```bash
kohaku unshield --protocol tornado --next --amount-formatted 1.0 --broadcast
```

Or take everything available:

```bash
kohaku unshield --protocol tornado --next --amount-max --broadcast
```

Amounts must still match Tornado note rules (ETH: multiples of 0.1).

## Network metadata (important)

Unshields are submitted through a paymaster / bundler path (Pimlico). That means the operator can see **your IP address and related request metadata** at withdrawal time, even though the on-chain deposit↔withdraw link is broken by Tornado.

Practical mitigation: run the unshield step over **device-level Tor or a trustworthy VPN**, so your home/work IP is not sitting next to that UserOperation.

This does not replace waiting with funds shielded — it is an extra layer for the moment you withdraw.

## After unshielding

```bash
kohaku balances --verbose
```

You should see Tornado private balance down and the new public address funded (minus fees).

From here you can:

- [Transfer](./transfer.html) somewhere
- Use [tail calls](./tail-calls.html) to do a swap/call in the same unshield
- [Use a dapp](./dapps.html) via a clean browser wallet
