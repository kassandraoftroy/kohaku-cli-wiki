---
title: Managing Ethereum Names
order: 19
section: appendix
summary: Renew, transfer, and update records on .eth / .gwei / .wei names
---

Once you have a name on your profile (usually via [Init Profile](./init-profile.html)), the CLI can manage it without leaving the terminal. These commands work for top-level **ENS** (`.eth`), **GNS** (`.gwei`), and **WNS** (`.wei`).

Dry-run by default — add `--broadcast` when the printed payload looks right. The signing account should be the name owner (for ENS, the **manager** when changing records).

## Set a text record

```bash
kohaku set-name-text-record --name something.gwei --key url --value https://example.com
kohaku set-name-text-record --name something.gwei --key url --value https://example.com --broadcast
```

Common keys: `url`, `avatar`, `com.twitter`, etc. Pass an empty `--value` to clear. Interactive mode prompts for `--key` / `--value` if omitted.

## Set website / contenthash

```bash
kohaku set-name-website --name something.gwei --content-hash ipfs://bafy…
kohaku set-name-website --name something.gwei --content-hash ipfs://bafy… --broadcast
```

`--content-hash` must start with `ipfs://` or `bzz://`.

## Renew a name

```bash
kohaku renew-name --name something.gwei
kohaku renew-name --name something.eth --years 1 --broadcast
```

ENS takes `--years` (interactive default `1`). GNS/WNS always add one year. Anyone may pay on-chain; the CLI prefers the name owner when that account is in the wallet.

## Transfer a name

Move ownership (and for ENS, optionally the manager) to another address or name:

```bash
kohaku transfer-name --name something.gwei --to 0xRecipient
kohaku transfer-name --name something.eth --to 0xRecipient --role both --broadcast
```

`--role` is ENS-only: `owner`, `manager`, or `both` (default). GNS/WNS only transfer the NFT owner. Use this when bringing an existing name onto kohaku index `0` before [init-profile](./init-profile.html), or when sending a name away.

## Also useful

```bash
# set this name as the account’s primary reverse record
kohaku set-name-reverse-record --name something.gwei --broadcast

# register a name without the full init-profile flow
kohaku register-name --protocol gns --name something.gwei --broadcast
```

Full flags: [Full Commands Reference](./commands.html).
