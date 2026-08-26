---
title: Fetch Sync Cache
order: 20
section: appendix
summary: Prefetch Railgun Subsquid + Tornado saga history so first syncs start from disk
---

The first `balances` / `shield` / `unshield` on a fresh wallet has to page a lot of **public** protocol history over the network: Railgun Subsquid and Tornado saga HTTP. This could make for a very slow "first sync" over Tor. From 0.0.4 that history can live under `<dataDir>/public-sync-cache` (default `~/.kohaku-cli/public-sync-cache`).

`fetch-sync-cache` downloads a published snapshot of those pages so later syncs replay most of the history **from disk** instead of paging it over Tor. Anything newer than the snapshot is still fetched live and written through, so the cache stays current as you use it.

This is **not** proving keys. Event sync does not need [`fetch-artifacts`](./fetch-artifacts.html). Artifacts are for prove / unshield later.

Privacy Pools is **not** in the snapshot (cold sync is bundled state JSON + `eth_getLogs`, which never goes through this HTTP cache). Its first sync stays slow.

## Prefetch once (recommended)

```bash
kohaku fetch-sync-cache
```

Default route is Tor. The snapshot is a **manifest plus ~8 MiB chunks**, not one huge archive. Each chunk is `sha256`-checked and extracted on arrival, so a dropped Tor circuit costs one chunk instead of the whole transfer. Re-running skips chunks already on disk (interrupted downloads are resumable).

## Optional env vars

```bash
# snapshot base (default shown)
export KOHAKU_SYNC_CACHE_BASE_URL=https://artifacts.0000000000.org/sync-cache/v1

# per-chunk Tor/HTTP budget in ms (default 300000); 3 attempts each
export KOHAKU_SYNC_CACHE_CHUNK_TIMEOUT_MS=300000

# stop storing new pages once the cache hits this size (default 1 GiB)
export KOHAKU_PUBLIC_SYNC_CACHE_MAX_BYTES=1073741824
```

Chunk URLs are excluded from proving-artifact routing, so the 45s `KOHAKU_TOR_CDN_TIMEOUT_MS` cap does **not** apply to them.

The cache **never evicts**: at the byte ceiling, new responses stop being stored instead of deleting snapshot pages. Wipe it with:

```bash
kohaku clear-tor-cache --public-sync
```

## When to run it

- After a fresh install / new data directory, **before** the first `balances --include …` / `shield` / `unshield` (especially on mainnet)
- After `clear-tor-cache --public-sync` or moving `--dataDir`
- When a first-time Tornado / Railgun sync is painfully slow over Tor — prefetch, then retry

Exits non-zero if any chunk ultimately failed. Entries that did land are still valid — re-run to retry the rest.

Full flags (including publisher `--pack`): [Full Commands Reference](./commands.html).

## Related

- [Set Env](./env.html) — sync-cache / artifacts env vars
- [Fetch Artifacts](./fetch-artifacts.html) — proving keys (prove / unshield), a separate cache
- [Network Traffic](./network-traffic.html) — Tor vs clearnet
- [Check Balances](./balances.html) — first private sync uses this cache
