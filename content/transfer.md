---
title: Transfer Funds
order: 11
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

## Stealth transfers (by name)

If the recipient has published a scheme-1 stealth meta-address (via [Init Profile](./init-profile.html) / ERC-6538, or a name text record), you can pay them privately with `--stealth`:

```bash
kohaku transfer --from 0xYourAddress --to tatsumaki.gwei --stealth --amount-formatted 0.05
kohaku transfer --from 0xYourAddress --to tatsumaki.gwei --stealth --amount-formatted 0.05 --broadcast
```

The CLI resolves their stealth meta from the name (text record or registry), then sends an EIP-5564 stealth transfer to a fresh one-time address. If they have **not** registered a stealth meta-address, the command errors (it cannot find a stealth meta-address for that name).

You can also pass a raw `st:…` meta URI as `--to` with `--stealth`.

## Privacy note

A transfer from account A to account B **publicly links** them. Sending between your own kohaku accounts is still a link. If those accounts were meant to stay separate, you just undid that — see [Keeping activity delinked](./delinked.html).

Prefer: unshield → pay the external destination directly (or use [tail calls](./tail-calls.html)) rather than hopping through several of your own addresses. Stealth transfers (`--stealth`) avoid linking the payment to a reused recipient address — the receiver still discovers it with `balances`.

