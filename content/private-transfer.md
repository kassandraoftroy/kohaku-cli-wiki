---
title: Private Transfer
order: 9
summary: Pay someone an exact amount from private balance in one step
---

`private-transfer` is the easy path when you want to **pay someone exact `Y`** from private balance without manually building `--tail-calls`.

For a public recipient, it unshields through a fresh public account in your wallet and forwards exact `Y` to `--to`. Anything leftover (Tornado note remainder, unused-gas refund) stays on that fresh account — not on the recipient.

Works on **Tornado**, **Privacy Pools**, and **Railgun** (same EIP-7702 / paymaster model as unshield). You can also use `transfer --from tornado`, `--from privacy-pools`, or `--from railgun`.

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

- **Tornado** — the paymaster fee comes from the unshielded notes, so the CLI selects notes that cover the transfer **plus** that fee. A `0.1 ETH` payment may need more than `0.1 ETH` in notes; the tail pays exactly `0.1` and the remainder stays on the fresh account.
- **Tornado pool choice** — extended ETH denominations are enabled by default, but their anonymity sets may be much smaller. Add `--exclude-new-pools` to spend only classic pools. This does not change sync or balances.
- **Tornado fees** — the preview and leftover calculation use the fee committed in the prepared proof. If that fee leaves too little for the exact transfer, the CLI stops before broadcasting.
- **Privacy Pools** — unshields the exact transfer amount; the paymaster fee is taken from private balance on top. The fresh account is the EIP-7702 delegate and refund recipient, so unused-gas change does **not** go to `--to`.
- **Railgun** — same “exact transfer” idea; treasury fee is added on top, and bundler gas is paid from shielded WETH.
- **Railgun to `0zk…`** — stays private inside Railgun, without an unshield or public receiving account. `eth` selects private WETH. The ERC-4337 paymaster still charges private WETH for gas.

Use `--amount-max` (or enter `max` interactively) to send the largest recipient amount after estimated protocol and gas fees:

```bash
kohaku private-transfer --protocol railgun --to 0xFriend --amount-max
```

Legacy and signature-derived notes remain separate when calculating the maximum. Railgun also reserves private WETH for gas, including transfers to a Railgun `0zk…` address. Use [`unshield`](./unshield.html) with [`--tail-calls`](./tail-calls.html) when you need custom calldata (swaps, routers, multi-call); `private-transfer` has no `--next` or `--tail-calls`.

## Related

- [Unshield Tail Calls](./tail-calls.html) — custom post-payout calldata
- [Transfer Funds](./transfer.html) — send from a public account after it is already funded
- [Using Dapps](./dapps.html) — where this sits in the preference order
