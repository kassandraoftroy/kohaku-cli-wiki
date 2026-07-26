---
title: Dust Management
order: 14
summary: Deal with amounts too small for a Tornado note
---

Tornado only accepts **fixed note sizes**. Anything left over — e.g. `0.037 ETH` after shielding `1.0` — is **dust**. Dust is annoying because you cannot deposit it into Tornado as-is, and moving it carelessly can link addresses.

## What not to do

- Do **not** sweep dust from many fresh addresses into one “dust jar” address if those addresses were meant to stay unrelated — that consolidation is a public link.
- Do **not** burn privacy just to clean up tiny leftovers.

## Practical approach

1. Prefer receiving amounts that already fit note sizes when you can influence the send.
2. Shield every full note you can; leave dust parked on its original fresh address if it is tiny and inactive.
3. When dust from **related** activity (same receive story) adds up toward a full note, shield that note.
4. When you need to **accumulate unrelated dust** toward a full Tornado note without linking the source addresses on the public chain, use another privacy protocol such as **Railgun** as a temporary holding pool — then exit into a Tornado-sized shield when you have enough.

```bash
kohaku shield --protocol railgun --amount-formatted 0.03 --broadcast
# …repeat from other dust sources over time…

# while funds sit in both places, check both:
kohaku balances --include tornado,railgun

# later: unshield from Railgun to a fresh address, then shield into Tornado
kohaku unshield --protocol railgun --next --amount-max --broadcast
```

> **Tip:** Dust hygiene is optional perfectionism at small sizes. Prioritize correct receive → shield → wait → unshield habits for the large balances first.
