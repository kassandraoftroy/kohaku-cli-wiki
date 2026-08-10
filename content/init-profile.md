---
title: Init Profile
order: 4
summary: Fund index 0 and publish your public name + stealth inbox
---

Next we set up your wallet **profile** — a public name + stealth inbox on HD account index `0`.

## Fund index 0

`init-profile` needs a little ETH on index `0` (gas + name registration). The first run of `next-fresh-address` should return you that account:

```bash
kohaku next-fresh-address
```

Send ETH to the printed address, then confirm:

```bash
kohaku balances --verbose
```

You should see index `0` with an ETH balance. Ideally, later funds you intend to hold and [shield](./shield.html) should go to **new** fresh addresses — not this one. See [Receive Funds](./receive.html).

## Run init-profile

Pick a name (this guide uses `.gwei`) and publish:

```bash
kohaku init-profile --name your-profile-name.gwei
```

Dry-run first (no `--broadcast`), then:

```bash
kohaku init-profile --name your-profile-name.gwei --broadcast
```

That commit → wait ~60s → one UserOp registers the name, sets records, and publishes stealth keys on ERC-6538.

Check anytime with:

```bash
kohaku see-stealth-meta-address
```

`balances` will also show the profile name when reverse resolution works for index `0`.

## What a profile is

Your profile is the **public face** of an otherwise private wallet:

- **Index `0`** — long-lived identity account that owns the name and stealth keys
- **A name** — e.g. `something.gwei` (or `.eth` / `.wei`); technically optional, but recommended
- **Stealth keys on ERC-6538** — others can pay you to fresh one-time addresses; you discover them with `balances`

It is fine if the **name** doxxes “who you are” socially. What matters is keeping later **activity** off index `0`. Treat that account as inbox / front door — not where you shield, unshield, swap, or hop funds. Receives and private DeFi can stay delinked even while you advertise the name and stealth meta-address.

## Using an existing name

If you already own a `.eth` / `.gwei` / `.wei` name elsewhere:

1. Transfer **ownership** to your kohaku index-`0` address (for ENS, transfer **manager** too if needed)
2. Run `init-profile --name … --broadcast` with that name — the CLI reuses it instead of registering a new one

## Other options

```bash
# ENS (bare label needs --protocol)
kohaku init-profile --name alice --protocol ens --broadcast

# stealth keys only, no name
kohaku init-profile --no-name --broadcast
```

Provide exactly one of `--name` or `--no-name`.

## Discipline after setup

- **Do** advertise the name / stealth meta-address as your inbox
- **Do** receive via stealth / fresh addresses, then [shield](./shield.html)
- **Don’t** route Tornado / Railgun exits, dapp sessions, or consolidation through index `0`
- **Don’t** mix “known public face” txs with addresses you meant to keep unlinked — see [Keeping activity delinked](./delinked.html)

Next: [Receive Funds](./receive.html) on fresh addresses for money you intend to shield.
