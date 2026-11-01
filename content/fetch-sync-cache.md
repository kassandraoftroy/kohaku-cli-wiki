---
title: Fetch Sync Cache
order: 21
section: appendix
summary: Prefetch verified mainnet Railgun, Tornado, and Privacy Pools history
---

The first private sync on a fresh **mainnet** wallet can take a while. `fetch-sync-cache` installs a verified snapshot under `<dataDir>/sync-cache-v2` (default `~/.kohaku-cli/sync-cache-v2`) so Railgun, Tornado, and Privacy Pools can read most historical data locally. Sepolia continues to use its existing live sync path.

The snapshot includes bounded Railgun history, historical PPOI list leaves, and frozen Tornado and Privacy Pools Saga data. Newer blocks still come from live sources. PPOI Merkle-root validation, TXID status, proof submission, and the growing list tip remain live. A first sync also works without the snapshot; it simply fetches history live.

This is **public sync history**, not proving keys. Proving circuits are bundled with the CLI and need no separate download.

## Prefetch once

```bash
kohaku fetch-sync-cache
```

The CLI checks each downloaded file against its size and SHA-256 hash. An interrupted download can resume. The snapshot becomes active only after **every** file verifies; partial downloads are not used for sync. Re-run the command if a file fails.

Tor is used by default. `--without-tor` downloads over clearnet, which reveals that this IP fetched public pool data:

```bash
kohaku fetch-sync-cache --without-tor
```

Use `--force` to download files again even if they already verify locally. Set `KOHAKU_SYNC_CACHE_BASE_URL` to use another snapshot host; the default is `https://artifacts.0000000000.org/sync-cache/v2`. Each file gets a five-minute download budget and three attempts.

Older `<dataDir>/public-sync-cache` data from the v1 format is left on disk but is **not read** by v0.1.0. To remove both old and new caches:

```bash
kohaku clear-tor-cache --public-sync
```

If you are updating an existing wallet, [Upgrading to 0.1.0](./upgrading-to-0.1.0.html) also covers the Railgun resync and legacy private notes.

For the command flags, see [Full Commands Reference](./commands.html).

## Related

- [Set Env](./env.html) — RPC, Tor, and cache settings
- [Network Traffic](./network-traffic.html) — Tor vs clearnet
- [Check Balances](./balances.html) — first private sync uses this cache
