---
title: Shield Funds
order: 7
summary: Move public ETH and stablecoins into Tornado Cash
---

Shielding is how you break the on-chain link between “where funds came from” and “where they go later.”

Default path in this guide: **receive on a fresh address → shield into Tornado → leave funds private for a while.**

## Dry run first

Omit `--broadcast` to see the planned transaction without sending it:

```bash
kohaku shield --protocol tornado --amount-formatted 1.0
```

Interactive mode lets you pick the public account that holds the funds. When it looks right, add `--broadcast`:

```bash
kohaku shield --protocol tornado --amount-formatted 1.0 --broadcast
```

For ERC20s, pass the token:

```bash
kohaku shield --protocol tornado --token USDC --amount-formatted 1000 --broadcast
kohaku shield --protocol tornado --token DAI --amount-formatted 1000 --broadcast
```

For now these are the only relevant tokens with tornado pools, hopefully more tokens and amounts get bootstrapped and we'll add them to the CLI.

## Inspect a shield without the tokens

A normal dry-run **simulates** the transaction, so it fails if the sender does not hold the funds yet. Pass `--skip-sim` to still print the planned payloads — useful when you want the call data for a later [unshield `--tail-calls`](./tail-calls.html), or to inspect a shield from an address that is not funded yet:

```bash
kohaku shield --from 1 --amount-formatted 0.1 --skip-sim
```

`--skip-sim` is dry-run only (cannot be combined with `--broadcast`). Fees in `--non-interactive` JSON stay in the schema but are zeroed.

## Note sizes

Tornado uses **fixed denomination notes**. For ETH, deposits must be an exact multiple of **0.1 ETH** (e.g. `0.1`, `1.3` — not `1.35`).

Shield **as much as fits** into valid notes from the fresh address. Leave leftovers alone for now — see [Dust Management](./dust.html).

## After shielding

```bash
kohaku balances
```

Public balance on that address should drop; Tornado private balance should rise.

## Let it sit

Do **not** unshield immediately. The privacy of a withdrawal depends partly on other people depositing and withdrawing around the same time. Leaving funds shielded for a meaningful period is part of the point.

When you eventually need public funds again, go to [Unshield Funds](./unshield.html).
