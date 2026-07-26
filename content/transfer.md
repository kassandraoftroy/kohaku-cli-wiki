---
title: Transfer Funds
order: 10
summary: Send ETH or ERC-20s from a public account
---

Once funds are on a public account (usually after an [unshield](./unshield.html)), you can move them with the CLI.

If you already know the recipient and amount **before** unshielding, prefer attaching the payment as a [tail call](./tail-calls.html) so the fresh address never sits idle with the full note. Use `transfer` when you already unshielded, or when you decide the destination only afterward.

## Simple transfers

Dry-run a send (no `--broadcast`):

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --amount-formatted 0.05
```

Then broadcast when it looks right:

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --amount-formatted 0.05 --broadcast
```

ERC-20s (example: USDC):

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --token USDC --amount-formatted 100 --broadcast
```

## Send the full balance

`--amount-max` means “send whatever this address currently holds of that asset” — the full ERC-20 balance, or for ETH the full balance minus what must be reserved for gas:

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --token USDC --amount-max --broadcast
kohaku transfer --from 0xYourAddress --to 0xRecipient --amount-max --broadcast
```

## Privacy note

A transfer from account A to account B **publicly links** them. Sending between your own kohaku accounts is still a link. If those accounts were meant to stay separate, you just undid that — see [Keeping activity delinked](./delinked.html).

Prefer: unshield → pay the external destination directly (or use [tail calls](./tail-calls.html)) rather than hopping through several of your own addresses.
