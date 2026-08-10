---
title: Receive Funds
order: 5
summary: Get a fresh address and receive ETH or stablecoins
---

Every time money comes in — from yourself, an exchange, a friend, a payroll — use a **fresh address**. Reusing addresses links deposits together on-chain.

## Get a fresh address

```bash
kohaku next-fresh-address
```

This prints a new `0x…` address from your wallet and saves it. Send funds **to that address only** and **ideally only once**.

### Receiving from yourself

If you are moving funds from another wallet you already control (hot wallet, exchange withdrawal, hardware wallet):

1. Run `kohaku next-fresh-address`
2. Withdraw / transfer to that address
3. Wait for confirmation, then [check balances](./balances.html)

### Receiving from someone else

1. Same flow — generate a fresh address, give **only that address** to the sender. Do not hand out an address you have already used for other activity.

OR 

2. Give them your stealth inbox `st:eth:0xabc...123` or if they have a wallet client that natively uses the stealth address protocol you can just give them your profile name `something.gwei` and their wallet will automagically route it to a fresh address for you. This is convenient because you don't need to give them a fresh address everytime you expect to recieve, they will naturally generat it using the stealth address protocol.

## What to receive

This guide focuses on **ETH**, **USDC**, and **DAI** on mainnet. Those are the assets you can later [shield into Tornado Cash](./shield.html). These Tornado pools have the most usage and thus give the most privacy. (Ideally more tokens and sizes are bootstrapped!)

> **Tip:** Prefer receiving amounts that fit Tornado note sizes cleanly (for ETH that means multiples of **0.1 ETH** + small delta for gas). Leftover dust can be awkward — see [Dust Management](./dust.html).

## Next

Once funds show up on the fresh address, [check balances](./balances.html), then [shield](./shield.html) as much as you can into Tornado.
