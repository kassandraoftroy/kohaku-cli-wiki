---
title: Receive Funds
order: 4
summary: Get a fresh address and receive ETH or stablecoins
---

Every time money comes in — from yourself, an exchange, a friend, a payroll — use a **fresh address**. Reusing addresses links deposits together on-chain.

## Get a fresh address

```bash
kohaku next-fresh-address
```

This prints a new `0x…` address from your wallet and saves it. Send funds **to that address only**.

### Receiving from yourself

If you are moving funds from another wallet you already control (hot wallet, exchange withdrawal, hardware wallet):

1. Run `kohaku next-fresh-address`
2. Withdraw / transfer to that address
3. Wait for confirmation, then [check balances](./balances.html)

### Receiving from someone else

Same flow — generate a fresh address, give **only that address** to the sender. Do not hand out an address you have already used for other activity.

## What to receive

This guide focuses on **ETH**, **USDC**, and **DAI** on mainnet. Those are the assets you will later [shield into Tornado Cash](./shield.html).

> **Tip:** Prefer receiving amounts that fit Tornado note sizes cleanly (for ETH that means multiples of **0.1 ETH**). Leftover dust is awkward — see [Dust Management](./dust.html).

## Next

Once funds show up on the fresh address, [check balances](./balances.html), then [shield](./shield.html) as much as you can into Tornado.
