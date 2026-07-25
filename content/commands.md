---
title: Commands
order: 15
section: appendix
summary: Short command reference for kohaku-cli
---

Quick map of the commands used in this guide. Flags evolve — when in doubt, run `kohaku <command> --help`.

| Command | What it does |
|---|---|
| `create-wallet` | Create or `--import` an encrypted seed wallet |
| `list-wallets` | List wallets on disk |
| `next-fresh-address` | Derive the next public address (`--peek` to preview only) |
| `balances` | Public + private balances (`--verbose` for per-address) |
| `shield` | Deposit from a public account into a privacy protocol |
| `unshield` | Withdraw private balance to a public address (`--next`, `--tail-calls`) |
| `transfer` | Send ETH or ERC-20 from a public account |
| `transact-raw` | Submit raw calldata from a public account |
| `export-private-key` | Print one account’s private key to stdout |

Most mutating commands **dry-run by default**. Add `--broadcast` only when you intend to send.

Common globals: `--wallet`, `--password`, `--rpc-url` / `RPC_URL`, `--dataDir`, `--non-interactive`.
