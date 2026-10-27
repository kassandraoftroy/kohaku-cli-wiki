---
title: Privacy Pools Ragequit
order: 20
section: appendix
summary: Exit one unapproved Privacy Pools note to its depositor
---

`ragequit` returns the **full remaining balance** of one unapproved Privacy Pools note to its **original depositor**. This is for notes that have not passed vetting. The original depositor must sign the transaction and have ETH for gas.

Find the note's label with `kohaku balances --include privacy-pools --verbose`, then dry-run:

```bash
kohaku ragequit --wallet myWallet --label NOTE_LABEL
```

Review the simulation, then add `--broadcast` to submit. The sender defaults to the note's depositor. If needed, select the original depositor with `--from 0`, `--from s0`, or `--from 0xYourAddress`; `--from-priv` lets the CLI derive an unsaved HD index. Older BIP-32 notes need `--scheme legacy` (the default is `signature`).

**Ragequit reveals the link to the deposit.** Approved notes should use [`unshield`](./unshield.html) instead. A shield transaction that reverted and never created a deposit has no note to ragequit.

```bash
kohaku ragequit --wallet myWallet --label NOTE_LABEL --scheme legacy --broadcast
```
