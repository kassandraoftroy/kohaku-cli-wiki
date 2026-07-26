---
title: Unshield Funds
order: 7
summary: Withdraw from Tornado to a fresh public address
---

Unshielding brings private Tornado balance back onto a public Ethereum address.

**Always unshield to a fresh address** — never back to the same address you shielded from, and preferably not to any address that already has history you care about linking.

## Unshield to a fresh address

```bash
kohaku unshield --next --amount-formatted 1.0
```

`--next` creates a brand-new public account in your wallet and pays it. Dry-run first (no `--broadcast`), then:

```bash
kohaku unshield --next --amount-formatted 1.0 --broadcast
```

Or take everything available:

```bash
kohaku unshield --next --amount-max --broadcast
```

Amounts must still match Tornado note rules (ETH: multiples of 0.1).

## Network metadata

Unshields are submitted through a paymaster / bundler path (Pimlico).

To mitigate privacy concerns (pimlico could see your ip and network metadata) the CLI routes all calls to the pimlico endpoint through Tor Network by default.

**If you disable Tor** on unsheilds (`--without-tor`) then **you are revealing your home IP to pimlico and linking oyur activity**

## After unshielding

```bash
kohaku balances --verbose
```

You should see Tornado private balance down and the new public address funded (minus fees).

From here you can:

- Prefer doing the next step **in the same unshield** with [tail calls](./tail-calls.html) when you already have calldata (or a plain pay)
- [Transfer](./transfer.html) somewhere if funds are already on the fresh address
- [Transact raw](./transact-raw.html) for contract calls after unshielding
- [Use a dapp in the browser](./dapps-with-browser.html) only as a last resort

See [Using Dapps](./dapps.html) for the full preference order.
