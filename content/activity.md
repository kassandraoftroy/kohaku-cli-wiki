---
title: Activity
order: 6.5
summary: See transactions submitted by this CLI
---

`activity` shows transactions **submitted by this CLI** for one wallet, newest first. It reads the wallet's encrypted local history, so it needs your wallet password but **no RPC or protocol sync**:

```bash
kohaku activity --wallet myWallet
```

Each entry shows the operation, chain, submission status, transaction hash when available, and UserOp hash for sponsored operations. `--non-interactive` prints versioned JSON:

```bash
kohaku activity --wallet myWallet --non-interactive --password-file ./wallet-password
```

The log starts with v0.0.12. It does not reconstruct older transactions or transactions sent by other tools. Dry runs and cancelled commands do not appear. A reverted receipt is marked `reverted`; if receipt lookup times out, the entry stays `submitted` and `activity` does not refresh it later. Back up the wallet's `activity/` directory with the rest of your wallet data.

This is a local transaction record. Use [Check Balances](./balances.html) to see current funds.
