---
title: Unshield Tail Calls
order: 8
summary: Unshield and call a contract in one step
---

Sometimes you do not want the full unshield amount sitting idle on a fresh address. With `--tail-calls`, the Tornado payout lands and then **immediately** runs one or more calls in the same flow — pay someone, hit a router, etc. — while any leftover stays on your fresh account.

(Note: currently this only works with Tornado Cash unshields, not the other Privacy Protocols)

## Peek the destination first

`--next` will pay a brand-new address. Peek it before you build calldata that needs to know that address (swaps, some dapp payloads):

```bash
kohaku next-fresh-address --peek
```

`--peek` prints the next fresh address **without** saving it.

## Format

```text
0x<target>:0x<calldata>[:0x<msg-value>]
```

- **ETH send** — `target` is the recipient, calldata is empty (`0x`), and `msg.value` is the amount
- **ERC-20 send** — `target` is the **token contract**, calldata encodes `transfer(recipient, amount)`, and there is **no** `msg.value`

## Example: pay someone in ETH

You owe `0.15 ETH`, but Tornado notes are fixed sizes — so unshield a full note (e.g. `0.2`) and forward exactly `0.15` in a tail call. The leftover (~`0.05` minus fees) stays on your fresh address.

`0.15 ETH` = `150000000000000000` wei = `0x214e8348c4f0000`:

```bash
kohaku unshield --protocol tornado --next --amount-formatted 0.2 \
  --tail-calls 0xRecipient:0x:0x214e8348c4f0000
```

## Example: pay someone in tokens

Same idea for USDC (or any ERC-20): unshield a full Tornado note of that token, then tail-call `transfer` for exactly `Y` to the recipient. Leftover tokens stay on your fresh address.

This example unshields `1000` USDC and immediately sends **250 USDC** to
`0xabcdeF0123456789012345678901234567890Abc`. USDC uses 6 decimals, so
`250` tokens = `250000000` base units (`0xee6b280`). Mainnet USDC is
`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`:

```bash
kohaku unshield --protocol tornado --next --token USDC --amount-formatted 1000 \
  --tail-calls 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48:0xa9059cbb000000000000000000000000abcdef0123456789012345678901234567890abc000000000000000000000000000000000000000000000000000000000ee6b280
```

The payload is standard ERC-20 `transfer(address,uint256)` calldata:
selector `0xa9059cbb`, then the recipient, then the amount. No third
`:value` field — token amounts live in the payload, not `msg.value`.

## Example: swap / dapp call

If you have router calldata, same pattern — unshield a bit more than you spend:

```bash
kohaku unshield --protocol tornado --next --amount-formatted 0.3 \
  --tail-calls 0x<swap-router>:0x<swap-payload>:0x<msg-value-in-hex>
```

Dry-run without `--broadcast` until the printed operation looks right, then broadcast.

> **Tip:** Unshield a full note that is **larger** than the payment / spend (`Y + delta`). The tail call moves exact `Y`; delta (minus fees) remains yours on the fresh account — all in one atomic interaction.

## When to use this

- You can build the calldata (or it is a plain ETH send with empty `0x` data)
- You want “fresh address appears mid-flow,” not “fresh address sits idle then separately sends”

If you cannot get a clean payload, use the [browser wallet path](./dapps.html) instead.
