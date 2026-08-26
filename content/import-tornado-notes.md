---
title: Import Tornado Notes
order: 18
section: appendix
summary: Bring legacy Tornado Cash notes into a kohaku wallet on mainnet
---

Deposits you made with the classic Tornado Cash UI (or another tool) live as **note strings**, not on your kohaku seed. To spend them from this CLI, import those strings into a mainnet wallet, then [unshield](./unshield.html) as usual.

## What a note looks like

Legacy format:

```text
tornado-<currency>-<denom>-<chainId>-0x…
```

Mainnet examples (chain id `1`):

```text
tornado-eth-0.1-1-0x…
tornado-eth-1-1-0x…
tornado-dai-1000-1-0x…
```

Sepolia uses `11155111` instead of `1`. A note for the wrong chain will not import into a mainnet wallet (`wrong-chain`).

> **Treat notes like seed material.** Anyone with an unspent note can withdraw it. Do not paste into websites, chat, or screenshots. Prefer pasting once into a local terminal, then clear scrollback / clipboard.

## Practical mainnet flow

1. Use a **mainnet** kohaku wallet (`create-wallet` without `--testnet`) with `RPC_URL` pointing at mainnet (ideally a local node).
2. Have `DEFAULT_PRIVACY_PROTOCOL=tornado` (or pass `--include tornado` later).
3. Import one or more notes (quote each string):

```bash
kohaku import-tornado-note 'tornado-eth-1-1-0xYourNoteSecret…'
```

Multiple notes in one go:

```bash
kohaku import-tornado-note \
  'tornado-eth-0.1-1-0x…' \
  'tornado-eth-1-1-0x…'
```

The CLI syncs against chain state (Tornado saga / pool data — Tor by default; see [Network traffic](./network-traffic.html)) and prints a status per note:

| Status | Meaning |
|---|---|
| `imported` | Note matched an unspent deposit and is stored in this wallet |
| `not-found` | No matching unspent deposit (already spent, typo, or not yet synced) |
| `wrong-chain` | Note’s `chainId` does not match this wallet’s network |

4. Confirm private balance:

```bash
kohaku balances --include tornado --verbose
```

5. Withdraw like any other Tornado balance:

```bash
kohaku unshield --next --amount-formatted 1.0
kohaku unshield --next --amount-formatted 1.0 --broadcast
```

## Where notes usually come from

- Backups / copies you saved when depositing in the classic Tornado interface
- `export-tornado-note` from another kohaku wallet (same denomination you want to move):

```bash
kohaku export-tornado-note --amount-formatted 1.0
```

Export prints raw secrets to stdout — same care as import. Interactive mode asks before revealing; `--non-interactive` skips that confirm.

## Tips

- Import only into a wallet you trust to hold those secrets long-term. After a successful import, treat the old plaintext note file as spent credentials still (until you have unshielded and are sure nothing else has a copy).
- Saga CDN / proving artifacts are **Tor-or-fail** (no clearnet fallback). Prefetch saga history with [`fetch-sync-cache`](./fetch-sync-cache.html) so import / `balances` do not page the whole CDN over Tor; pre-warm proving keys with [`fetch-artifacts`](./fetch-artifacts.html) before unshield. See [Network traffic](./network-traffic.html).
- You do **not** need the original deposit address or seed — the note string is enough to prove and withdraw.

Full flags: [Full Commands Reference](./commands.html) (`import-tornado-note` / `export-tornado-note`).
