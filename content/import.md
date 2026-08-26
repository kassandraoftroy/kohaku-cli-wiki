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

On `--import`, the CLI writes `.stealth-start-block` so the first `balances` stealth scan starts at the Kohaku-schema floor (mainnet `25700000`, Sepolia `11455454`) unless you pass `--stealth-start-block`. That flag can still go back as far as the ERC-5564 announcer deploy block.

```bash
kohaku create-wallet my-restored-wallet --import --rpc-url "$RPC_URL" --stealth-start-block <block>
```

**If you do not expect any stealth reception yet** (new-to-you seed for kohaku workflows, or you know nothing was paid to this seed’s stealth meta-address), pass the **current / latest block** — same idea as a brand-new wallet, which records the chain tip automatically. That skips pointless pre-history.

If the seed may already have received stealth payments, set the floor to roughly when the seed was first used (or earlier), so `balances` can discover those announcements.

You can also pass `--stealth-start-block` on an individual `balances` run (it can back-date below the wallet file). Use `--skip-stealth-scan` to skip discovery for a faster run; already-imported stealth accounts still appear in public totals.

> Prefer creating a **new** kohaku wallet for privacy workflows and funding it via [fresh receives](./receive.html) + [shielding](./shield.html), rather than importing a long-lived doxxed seed and expecting Tornado to erase its history.

**Do not** use the same seed for a `--testnet` wallet and a mainnet wallet.

Note: import is especially useful when you want to use Railgun as a Privacy Protocol and already have a Railgun Seed Phrase with funds in the protocol. Importing this seed will automagically sync your Railgun balances and allow you to spend them via the CLI.
