---
title: Transfer Funds
order: 12
summary: Send ETH or ERC-20s from a public account or private protocol
---

You can send funds from a public account or directly from a private protocol with the CLI.

If you already know the recipient and amount **before** unshielding, prefer [`private-transfer`](./private-transfer.html) (exact pay) or a [tail call](./tail-calls.html) (custom calldata) so the fresh address never sits idle with the full note. Use `transfer` when you already unshielded, or when you decide the destination only afterward.

`transfer --from tornado`, `--from privacy-pools`, and `--from railgun` now use the same flow as `private-transfer --protocol …`. For example, dry-run a Tornado payment, then add `--broadcast` when ready:

```bash
kohaku transfer --from tornado --to 0xRecipient --amount-formatted 0.4
kohaku transfer --from tornado --to 0xRecipient --amount-formatted 0.4 --broadcast
```

The amount is what the recipient receives; the CLI handles the private withdrawal and fee. `--exclude-new-pools` also works with `--from tornado`. `--amount-max` works with public and private senders; for private transfers it reserves protocol and gas fees. `--sender-priv <key>` and `--stealth` are for public senders only. A Railgun `--to 0zk…` recipient receives a private transfer inside Railgun without unshielding.

## Simple transfers

Dry-run a send (no `--broadcast`):

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --amount-formatted 0.05
```

Then broadcast when it looks right:

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --amount-formatted 0.05 --broadcast
```

If `--from` is an address outside this wallet, an interactive broadcast asks for its private key with hidden input. A non-interactive broadcast requires `--sender-priv <key>`. The key must match `--from` and is not saved. An unsaved HD index from the wallet seed is derived automatically.

ERC-20s (example: USDC):

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --token USDC --amount-formatted 100 --broadcast
```

## Send the full balance

For a public sender, `--amount-max` means “send whatever this address currently holds of that asset” — the full ERC-20 balance, or for ETH the full balance minus what must be reserved for gas:

```bash
kohaku transfer --from 0xYourAddress --to 0xRecipient --token USDC --amount-max --broadcast
kohaku transfer --from 0xYourAddress --to 0xRecipient --amount-max --broadcast
```

For a private sender, use `--from tornado`, `--from privacy-pools`, or `--from railgun` with `--amount-max` to send the largest recipient amount after estimated fees. You can also enter `max` interactively.

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

Prefer: [`private-transfer`](./private-transfer.html) / [tail calls](./tail-calls.html) straight to the external destination rather than hopping through several of your own addresses. Stealth transfers (`--stealth`) avoid linking the payment to a reused recipient address — the receiver still discovers it with `balances`.

