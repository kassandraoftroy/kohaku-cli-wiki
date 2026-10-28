---
title: Unshield Funds
order: 8
summary: Withdraw from Tornado to a fresh public address
---

Unshielding brings private Tornado balance back onto a public Ethereum address.

**Always unshield to a fresh address** — never back to the same address you shielded from, and preferably not to any address that already has history you care about linking.

## Unshield to a fresh address

```bash
kohaku unshield --next --amount-formatted 1.0
```

`--next` creates a brand-new public account in your wallet and pays it. Dry-run first (no `--broadcast`), then:

```bash
kohaku unshield --next --amount-formatted 1.0 --broadcast
```

Or take everything available:

```bash
kohaku unshield --next --amount-max --broadcast
```

> **IMPORTANT:** when you unshield multiple notes at once e.g. 0.2 ETH or from multiple pools at once e.g. 1.1 ETH you could be decreasing your anonymity set significantly. Especially if you sheilded 1.1 ETH into two pool from a public account prior. Be mindful of these fingerprinting techniques! 

Amounts must still match Tornado notes you actually hold. The new ETH pools include 0.01 ETH notes by default, but a single 1 ETH note cannot satisfy a 0.1 or 0.2 ETH withdrawal. The new denominations may have much smaller anonymity sets. `--exclude-new-pools` spends only classic Tornado notes; it does not hide new-pool notes from `balances`.

Older Tornado and Privacy Pools notes remain spendable. A withdrawal uses either legacy or newer signature-derived notes, never both in the same withdrawal. `--amount-max` uses the larger spendable balance of those two schemes, not their sum.

Tornado unshields now check the final gas budget before broadcast. If gas estimation is unavailable, a standard unshield may use a conservative SDK fallback; the CLI warns you before broadcasting and includes `gasEstimation` in JSON output. Unshields with `--tail-calls`, including `private-transfer`, still require a successful gas estimate. The fee shown in the preview is the one committed in the prepared proof.

## Network metadata

Unshields are submitted through a paymaster / bundler path (Pimlico). That traffic — and other privacy-protocol HTTP — goes through **Tor by default**. Ethereum RPC stays clearnet (ideally a local node).

**If you disable Tor** (`--without-tor` or `KOHAKU_WITHOUT_TOR=1`) you reveal your home IP to Pimlico and link that activity to you.

See [Network traffic](./network-traffic.html) for the full picture and how to audit contacts with `view-network-traffic`.

## After unshielding

```bash
kohaku balances --verbose
```

You should see Tornado private balance down and the new public address funded (minus fees).

From here you can:

- Prefer [`private-transfer`](./private-transfer.html) when you just want to pay someone an exact amount from private balance (no manual calldata)
- Prefer doing the next step **in the same unshield** with [tail calls](./tail-calls.html) when you already have custom calldata
- [Transfer](./transfer.html) somewhere if funds are already on the fresh address
- [Transact raw](./transact-raw.html) for contract calls after unshielding
- [Use a dapp in the browser](./dapps-with-browser.html) only as a last resort

See [Using Dapps](./dapps.html) for the full preference order.
