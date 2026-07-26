---
title: Transact Raw
order: 11
summary: Submit dapp calldata from a public account after unshielding
---

When you have the full call (target, payload, optional `msg.value`) but **cannot** attach it to the unshield — or you already unshielded — drive it from the CLI with `transact-raw`. No browser, no connected frontend.

This sits below [tail calls](./tail-calls.html) in the [Using Dapps](./dapps.html) preference order: same “you built the calldata” idea, just as a separate step after funds are already on a public address.

## Usage

Dry-run first (no `--broadcast`):

```bash
kohaku transact-raw --from 0xYourAddress \
  --targets 0xContract \
  --payloads 0xCalldata
```

Then broadcast when the printed operation looks right:

```bash
kohaku transact-raw --from 0xYourAddress \
  --targets 0xContract \
  --payloads 0xCalldata \
  --broadcast
```

Optional ETH with the call:

```bash
kohaku transact-raw --from 0xYourAddress \
  --targets 0xContract \
  --payloads 0xCalldata \
  --values 0x<msg-value-in-hex> \
  --broadcast
```

Multiple calls are supported — pass matching lists for `--targets` / `--payloads` / optional `--values`.

## When to prefer this

- You can get clean calldata (router, contract, etc.) without connecting a wallet to a dapp UI
- You already unshielded to a fresh address, or the call cannot ride along with `--tail-calls`

If the call *can* ride with the unshield, prefer [tail calls](./tail-calls.html) instead.

If you cannot build the payload at all and the dapp insists on a connected wallet, use the [browser path](./dapps-with-browser.html) — last resort.
