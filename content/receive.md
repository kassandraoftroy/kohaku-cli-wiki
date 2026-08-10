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

1. Foolproof Option: same flow as above — generate a fresh address, give **only that address** to the sender. Do not hand out an address you have already used for other activity. (Downside: you have to go generate a fresh address every time you want to recieve)

2. Advanced Option: Give sender your stealth inbox `st:eth:0xabc...123` or ideally you could just give them your profile name `something.gwei` if their wallet client knows to resolve your stealth inbox from there and route funds to a fresh address all under the hood. Upside: you can recieve to fresh addresses over and over without having to coordinate the receiving address each time (also easier to remember human readable names for sender). Downside: Sender needs software that knows "stealth address" protocol / an uninitiated sender might just send to your doxxed something.gwei account directly.

## What to receive

This guide focuses on **ETH**, **USDC**, and **DAI** on mainnet as preferred tokens to recieve since those are the assets you can later [shield into Tornado Cash](./shield.html). These Tornado pools have the most usage and thus give the most privacy. (Ideally more tokens and sizes are well bootstrapped!)

> **Tip:** Prefer receiving amounts that fit Tornado note sizes cleanly (for ETH that means multiples of **0.1 ETH** + small delta for gas). Leftover dust can be awkward — see [Dust Management](./dust.html).

## Next

Once funds show up on the fresh address, [check balances](./balances.html), then [shield](./shield.html) as much as you can into Tornado.
