---
title: Import Wallet
order: 14
section: appendix
summary: Restore a wallet from an existing seed phrase
---

If you already have a seed phrase, you can import it instead of creating a new one:

```bash
kohaku create-wallet my-restored-wallet --import
```

You will be prompted for the mnemonic (masked) and an encryption password. The CLI needs `RPC_URL` set so it can scan which derived addresses already have activity and resume the account index sensibly.

> Prefer creating a **new** kohaku wallet for privacy workflows and funding it via [fresh receives](./receive.html) + [shielding](./shield.html), rather than importing a long-lived doxxed seed and expecting Tornado to erase its history.

**Do not** use the same seed for a `--testnet` wallet and a mainnet wallet.

Note: import is especially useful when you want to use Railgun as a Privacy Protocol and already have a Railgun Seed Phrase with funds in the protocol. Importing this seed will automagically sync your Railgun balances and allow you to spend them via the CLI.
