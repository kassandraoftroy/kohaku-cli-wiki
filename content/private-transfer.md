---
title: Private Transfer
order: 9
summary: Pay someone an exact amount from private balance in one step
---

`private-transfer` is the easy path when you want to **pay someone exact `Y`** from private balance without manually building `--tail-calls`.

Under the hood it is `unshield --next` plus one transfer tail call: funds land on a fresh public account in your wallet, that account immediately forwards exact `Y` to `--to`, and anything leftover (Tornado note remainder, unused-gas refund) stays on the fresh account — not on the recipient.

Works on **Tornado**, **Privacy Pools**, and **Railgun** (same EIP-7702 / paymaster model as unshield).

## Pay someone in ETH

Dry-run first (no `--broadcast`):

```bash
kohaku private-transfer --to 0xFriend --amount-formatted 0.1
```

Then broadcast:

```bash
kohaku private-transfer --to 0xFriend --amount-formatted 0.1 --broadcast
```

`--to` can also be a stealth selector (`s0`) or a `.eth` / `.gwei` / `.wei` name.

## Tokens

```bash
kohaku private-transfer --to 0xFriend --token DAI --amount-formatted 50 --broadcast
```

## Protocol notes

- **Tornado** — the paymaster fee comes from the unshielded notes, so the CLI unshields the smallest note sum that covers the transfer **plus** that fee. Sending exactly `0.1 ETH` from `0.1` notes typically unshields `0.2`; the tail pays `0.1` and the remainder stays on the fresh account.
- **Tornado pool choice** — extended ETH denominations are enabled by default, but their anonymity sets may be much smaller. Add `--exclude-new-pools` to spend only classic pools. This does not change sync or balances.
- **Privacy Pools** — unshields the exact transfer amount; the paymaster fee is taken from private balance on top. The fresh account is the EIP-7702 delegate and refund recipient, so unused-gas change does **not** go to `--to`.
- **Railgun** — same “exact transfer” idea; treasury fee is added on top, and bundler gas is paid from shielded WETH.

There is no `--next`, `--tail-calls`, or `--amount-max` on this command — use [`unshield`](./unshield.html) with [`--tail-calls`](./tail-calls.html) when you need custom calldata (swaps, routers, multi-call).

## Related

- [Unshield Tail Calls](./tail-calls.html) — custom post-payout calldata
- [Transfer Funds](./transfer.html) — send from a public account after it is already funded
- [Using Dapps](./dapps.html) — where this sits in the preference order
