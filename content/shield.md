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

You can also shield from an address outside this wallet. Select it with `--from 0xYourAddress`; on an interactive broadcast, the CLI asks for its private key with hidden input. For a non-interactive broadcast, pass `--sender-priv <key>` as well. The key must match `--from` and is not saved. An unsaved HD index from this wallet's seed needs no separate key; the CLI derives it automatically. Dry runs do not need the sender key.

Prefer the hidden interactive prompt when possible: putting a key directly on a command line can expose it through shell history or process listings.

```bash
kohaku shield --protocol tornado --from 0xYourAddress --amount-formatted 0.1 --broadcast
```

For ERC20s, pass the token:

```bash
kohaku shield --protocol tornado --token USDC --amount-formatted 1000 --broadcast
kohaku shield --protocol tornado --token DAI --amount-formatted 1000 --broadcast
```

For now these are the only relevant tokens with tornado pools, hopefully more tokens and amounts get bootstrapped and we'll add them to the CLI.

**Privacy Pools** accepts any amount at or above the pool minimum (mainnet: ETH, USDC, USDT) — useful for dust that does not fit a Tornado note. For an **arbitrary ERC-20** with no Tornado / Privacy Pools pool, Railgun can shield it:

```bash
kohaku shield --protocol railgun --token 0xYourToken --amount-formatted 10 --broadcast
```

## Inspect a shield without the tokens

A normal dry-run **simulates** the transaction, so it fails if the sender does not hold the funds yet. Pass `--skip-sim` to still print the planned payloads — useful when you want the call data for a later [unshield `--tail-calls`](./tail-calls.html), or to inspect a shield from an address that is not funded yet:

```bash
kohaku shield --from 1 --amount-formatted 0.1 --skip-sim
```

`--skip-sim` is dry-run only (cannot be combined with `--broadcast`). Fees in `--non-interactive` JSON stay in the schema but are zeroed.

## Note sizes

Tornado uses **fixed denomination notes**. ETH pools include **0.01, 0.03, 0.1, 0.3, 1, 3, 10, and 30 ETH** sizes (10 ETH is also available on Sepolia). You can shield amounts such as **0.01** or **0.45 ETH** by combining notes. The amount must be an exact multiple of 0.01 ETH. Pass `--exclude-new-pools` to use only classic pools; then the minimum step is 0.1 ETH.

**The new denominations may have much smaller anonymity sets than the classic pools.** Check the pool selection in the shield preview before broadcasting. A smaller note is not automatically a more private note.

Interactive shields offer note packings and show the denominations, note count, and transaction count. Repeat `--exclude-denomination <amount>` to avoid a specific pool size; for example, `--exclude-denomination 0.03`. The confirmation shows a breakdown by denomination and the estimated fees, without listing pool contract addresses.

The CLI puts at most **five deposit notes per transaction** (approval calls do not count). Larger shields split into sequential transactions by default. If a later transaction fails, earlier deposits may already be shielded; check the reported hashes and amounts before retrying. Use `--disallow-multiple-userops` to reject a plan that needs more than one transaction.

After a successful Tornado shield, the CLI prints an Etherscan link for each transaction and `✔ Shield flow completed.` Sepolia transactions link to Sepolia Etherscan.

New Tornado and Privacy Pools deposits use signature-derived note secrets. Older notes remain in your wallet and can still be spent.

Before preparing new Tornado or Privacy Pools notes, the CLI refreshes complete protocol history and checks note indexes across pools and assets, including spent deposits. Tornado notes in one shield plan get distinct nonces even when they use different denominations or transactions. If that history cannot be verified through the sampled chain head, preparation stops. A pending external deposit can still race with a separately prepared shield.

Shield **as much as fits** into valid notes from the fresh address. Leave leftovers alone for now — see [Dust Management](./dust.html).

## After shielding

```bash
kohaku balances
```

Public balance on that address should drop; Tornado private balance should rise.

## Let it sit

Do **not** unshield immediately. The privacy of a withdrawal depends partly on other people depositing and withdrawing around the same time. Leaving funds shielded for a meaningful period is part of the point.

When you eventually need public funds again, go to [Unshield Funds](./unshield.html).
