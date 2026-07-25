---
title: Check Balances
order: 5
summary: See public and private balances
---

```bash
kohaku balances
```

You will pick your wallet (if you have more than one), enter the password, and wait for a short sync.

You should see:

- **Public** — ETH / USDC / DAI (and other tokens) sitting on your addresses, still linked to whoever sent them
- **Private** — what you have already shielded (with `DEFAULT_PRIVACY_PROTOCOL=tornado`, this is your Tornado balance)

For a per-address breakdown:

```bash
kohaku balances --verbose
```

Pin a wallet explicitly if you prefer:

```bash
kohaku balances --wallet my-mainnet-wallet --verbose
```

## Reading the result

- Fresh deposits show up under **Public** until you shield them
- After a successful [shield](./shield.html), public balance drops and private (Tornado) balance rises
- After an [unshield](./unshield.html), private drops and a (hopefully fresh) public address receives funds

If a deposit is missing, wait for more confirmations and run `balances` again. Also double-check you are on the right wallet and that `RPC_URL` points at mainnet.
