---
title: Upgrading to 0.1.0
order: 18
section: appendix
summary: Notes and sync data to revisit when upgrading an older wallet
---

If you used kohaku-cli before 0.1.0, keep your existing wallet directory and update the CLI as described in [Install](./install.html). These changes affect how older private notes and cached history are used.

## Tornado and Privacy Pools notes

New deposits use **signature-derived** note secrets. Older BIP-32 notes and imported Tornado note strings remain spendable as **legacy** notes. `balances --include tornado,privacy-pools --verbose` shows legacy notes when present.

An unshield or private transfer spends **one derivation scheme at a time**. It cannot combine legacy and signature-derived notes in one withdrawal. If neither scheme alone covers your requested amount plus fees, use separate withdrawals. `--amount-max` uses the larger spendable single-scheme balance, not the sum of both. The CLI warns when it spends legacy notes.

## Railgun history

The 0.0.16 Railgun implementation uses a Rust/WASM wallet. An existing Railgun wallet **rebuilds its history into a new encrypted checkpoint** on its next `balances --include railgun` (or other Railgun) sync; this can make that first sync take longer. Completed sync windows are saved so it can resume. The old `rg-storage.json` is preserved; you do not need to delete the wallet or manually reset it. Notes still require valid PPOI before spending, and the old `KOHAKU_RAILGUN_FORCE_VALID_POI` override was removed.

In v0.1.3, an older Railgun checkpoint also gets a one-time rebuild of its computed Merkle nodes. It may make the first sync after updating slower, but later syncs reuse those nodes.

## Sync cache

Run `kohaku fetch-sync-cache` again on mainnet. Version 0.1.0 uses a verified **v2** snapshot under `<dataDir>/sync-cache-v2` for Railgun, Tornado, and Privacy Pools history. It does not read the old `<dataDir>/public-sync-cache` snapshot. A first sync still works without v2, but fetches history live and may take longer. Sepolia keeps its existing sync path.

The old cache is left on disk. `kohaku clear-tor-cache --public-sync` removes **both** cache directories if you want to clear them. See [Fetch Sync Cache](./fetch-sync-cache.html).
