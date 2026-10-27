---
title: Fetch Sync Cache
order: 21
section: appendix
summary: Prefetch Railgun Subsquid + Tornado saga history so first syncs start from disk
---

The first `balances` / `shield` / `unshield` on a fresh wallet has to page a lot of **public** protocol history over the network: Railgun Subsquid and Tornado saga HTTP. This could make for a very slow "first sync" over Tor. From 0.0.4 that history can live under `<dataDir>/public-sync-cache` (default `~/.kohaku-cli/public-sync-cache`).

`fetch-sync-cache` downloads a published snapshot of those pages so later syncs replay most of the history **from disk** instead of paging it over Tor. Anything newer than the snapshot is still fetched live and written through, so the cache stays current as you use it.

This is **public sync history**, not proving keys. Proving circuits are bundled with the CLI and need no separate download.

Privacy Pools **mainnet** history is fetched live from its saga CDN (sealed chunks are cached on the way). Sepolia Privacy Pools has no saga stream, so it stays on bundled state JSON plus `eth_getLogs`.

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

The per-chunk timeout is `KOHAKU_SYNC_CACHE_CHUNK_TIMEOUT_MS` (default 300000 ms).

The cache **never evicts**: at the byte ceiling, new responses stop being stored instead of deleting snapshot pages. Wipe it with:

```bash
kohaku clear-tor-cache --public-sync
```

## When to run it

- After a fresh install / new data directory, **before** the first `balances --include …` / `shield` / `unshield` (especially on mainnet)
- After `clear-tor-cache --public-sync` or moving `--dataDir`
- When a first-time Tornado / Railgun sync is painfully slow over Tor — prefetch, then retry
- Privacy Pools mainnet saga pages are filled live / cached separately; this snapshot still speeds Tornado + Railgun

Exits non-zero if any chunk ultimately failed. Entries that did land are still valid — re-run to retry the rest.

Full flags (including publisher `--pack`): [Full Commands Reference](./commands.html).

## Related

- [Set Env](./env.html) — sync-cache env vars
- [Proving Artifacts](./fetch-artifacts.html) — bundled proving circuits
- [Network Traffic](./network-traffic.html) — Tor vs clearnet
- [Check Balances](./balances.html) — first private sync uses this cache
