---
title: Keeping Activity Delinked
order: 13
summary: Habits that keep addresses from collapsing into one identity
---

Tornado breaks the **deposit → withdraw** link on-chain. Everything else you do can still glue identities back together. The habit is: treat each public address as a short-lived character, not a permanent persona.

## Core rules

1. **Receive on fresh addresses** — never reuse a deposit address across unrelated payments ([Receive Funds](./receive.html)).
2. **Shield soon, from that fresh address** — do not wander around DeFi first ([Shield Funds](./shield.html)).
3. **Wait while shielded** — do not unshield in the same breath you deposited.
4. **Unshield to a new fresh address** — use `--next`, not the address you came from ([Unshield Funds](./unshield.html)).
5. **Do not consolidate your own accounts** by transferring between them unless you are fine linking them forever.
6. **Short public sessions** — use an unshielded address for a purpose, then stop (or re-shield via a new receive → Tornado cycle).

## What creates links

- Paying from address A to address B (including your own)
- Approving and using the same address across many dapps over weeks
- Importing multiple “anonymous” keys into one browser wallet / seed
- Reusing the same address for payroll, friends, and DeFi
- Unshielding back to a known, previously used address

## Mental model

```text
someone pays you  →  fresh address  →  shield (Tornado)  →  wait
                                              ↓
                         unshield to NEW fresh address  →  do one job  →  done
```

Each time you need another private chapter, start the diagram again — do not keep extending the same public address’s history.
