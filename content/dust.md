---
title: Dust Management
order: 16
summary: Deal with amounts too small for a Tornado note
---

Tornado uses **fixed note sizes**, but can combine them: ETH deposits can be multiples of **0.01 ETH**, such as 0.45 ETH. A leftover smaller than 0.01 ETH — e.g. `0.007 ETH` — cannot be shielded into Tornado as-is. Moving that dust carelessly can link addresses. The newer small-denomination pools may have much smaller anonymity sets than classic pools.

## What not to do

- Do **not** sweep dust from many fresh addresses into one “dust jar” address if those addresses were meant to stay unrelated — that consolidation is a public link.
- Do **not** burn privacy just to clean up tiny leftovers.

## Practical approach

1. Prefer receiving amounts that already fit note sizes when you can influence the send.
2. Shield every full note you can; leave dust parked on its original fresh address if it is tiny and inactive.
3. When dust from **related** activity (same receive story) adds up toward a full note, shield that note.
4. When you need to **accumulate unrelated dust** toward a full Tornado note without linking the source addresses on the public chain, use **Privacy Pools** as a temporary holding pool (any amount at or above the pool minimum) — then exit into a Tornado-sized shield when you have enough. (For an asset with **no** Privacy Pools / Tornado pool, [Railgun](./commands.html) can shield arbitrary ERC-20s.)

```bash
kohaku shield --protocol privacy-pools --amount-formatted 0.03 --broadcast
# …repeat from other dust sources over time…

# while funds sit in both places, check both:
kohaku balances --include tornado,privacy-pools

# later: unshield from Privacy Pools to a fresh address, then shield into Tornado
kohaku unshield --protocol privacy-pools --next --amount-max --broadcast
```
