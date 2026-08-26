---
title: Import Wallet
order: 17
section: appendix
summary: Restore a wallet from an existing seed phrase
---

If you already have a seed phrase, you can import it instead of creating a new one:

```bash
kohaku create-wallet my-restored-wallet --import
```

You will be prompted for the mnemonic (masked) and an encryption password. The CLI needs `RPC_URL` set so it can scan which derived addresses already have activity and resume the account index sensibly.

## Stealth scan floor (`--stealth-start-block`)

By default, `--import` records the **current chain tip** in `.stealth-start-block` — same as a new wallet. Later `balances` runs do **not** walk historical ERC-5564 announcements.

Only pass `--stealth-start-block` if this seed may already have received stealth payments:

```bash
# historical scan from the Kohaku-schema floor (mainnet 25700000 / Sepolia 11455454)
kohaku create-wallet my-restored-wallet --import --rpc-url "$RPC_URL" --stealth-start-block

# or an explicit block (values below the ERC-5564 announcer deploy are rounded up)
kohaku create-wallet my-restored-wallet --import --rpc-url "$RPC_URL" --stealth-start-block <block>
```

You can also pass `--stealth-start-block` on an individual `balances` run (it can back-date below the wallet file). Use `--skip-stealth-scan` to skip discovery for a faster run; already-imported stealth accounts still appear in public totals.

> Prefer creating a **new** kohaku wallet for privacy workflows and funding it via [fresh receives](./receive.html) + [shielding](./shield.html), rather than importing a long-lived doxxed seed and expecting Tornado to erase its history.

**Do not** use the same seed for a `--testnet` wallet and a mainnet wallet.

Note: import is especially useful when you want to use Railgun as a Privacy Protocol and already have a Railgun Seed Phrase with funds in the protocol. Importing this seed will automagically sync your Railgun balances and allow you to spend them via the CLI.
