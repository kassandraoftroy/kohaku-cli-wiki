---
title: Create Wallet
order: 2
summary: Create a kohkau-cli wallet
---

> **IMPORTANT: It is essential to handle the seed phrase with care. Long term wallet security is entirely reliant on you-and-only-you having access to the seed phrase. If you lose access your funds are lost forever. If someone else gains access your funds are trivial to steal.**

## Create Wallet

Run this command with the desired wallet name (in this example `my-mainnet-wallet`): 

```bash
kohaku create-wallet my-mainnet-wallet
```

You're asked to provide a password and you're shown the unencrypted seed phrase just this once. Back it up properly (see below).

The seed phrase is only written to disk _encrypted_ (under the password). It is located in the wallet's data directory with hidden filename `.encrypted-seed.json`.

If you want to test out the CLI on testnet use `--testnet` flag on wallet creation. **DONT reuse a seedphrase on mainnet and testnet** as this can fingerprint/deanonymize activity (you'll use the same addresses on both networks).

## Seed Phrase Back Up (Advice)

There are tons of practical guides to seed phrase security, [here's one](https://onekey.so/blog/ecosystem/how-to-keep-your-seed-phrase-secure/) that is simple.

Everyone has a different risk profile so how to handle seed phrase backup is highly personal and not one-size-fits-all.

Still here is some practical advice:

1. Use a **strong password** that you won't forget. Don't store this password anywhere (e.g. don't put in a password manager).
2. **NEVER type the seed phrase into a website. NEVER keep a plaintext copy of the seed phrase stored on a computer that connects to the internet in any form.**
3. Write down the seed phrase on a piece of paper (or on metal!)
and store this in a secure location. This is your unecrypted back up, and protects you if e.g. you somehow forget the password.
4. If your password is strong and not known by 3rd parties, consider backing up the _encrypted_ seed file (`.encrypted-seed.json`) somewhere relatively private but accessible to you online (e.g. private cloud storage, private email).
5. Consider multiple paper/metal backups.
6. Good Luck. In practice, managing the seed phrase correctly is the biggest potential vector for loss or theft. These are the unavoidable responsabilities of self-custody.

