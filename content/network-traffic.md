---
title: Network Traffic
order: 22
section: appendix
summary: Tor vs clearnet — what the CLI contacts and how to audit it
---

By default, **all non-RPC network traffic** from the CLI goes through [Tor](https://github.com/privacy-ethereum/tor-js). The Ethereum RPC is the exception: it stays on clearnet, because it is hopefully a **local node** — and if it is not, a remote provider URL usually already carries an identifying API key anyway (public RPC endpoints are not strong enough to handle the amount of requests needed by the CLI)

There is **no Tor→clearnet fallback**. Saga CDN and proving-artifact downloads are Tor-or-fail (unless you explicitly pass `--without-tor` / set `KOHAKU_WITHOUT_TOR=1`).

## What goes over Tor

When you run `balances` (with private protocols), `shield`, `unshield`, `transfer`, `transact-raw`, name commands, Tornado note import/export, `fetch-sync-cache`, or `fetch-artifacts`, the CLI may contact:

| Category | Examples | Path |
|---|---|---|
| **pimlico** | Bundler / paymaster for Tornado and Railgun UserOps | Tor (most critical for IP privacy) |
| **subsquid** | Railgun indexer | Tor |
| **ppoi** | Railgun PPOI | Tor |
| **saga** | Tornado saga CDN | Tor-or-fail (no clearnet fallback) |
| **artifacts** | Proving artifacts (`KOHAKU_ARTIFACTS_BASE_URL`) | Tor-or-fail when not already cached on disk |
| **asp** / **fastrelay** | Privacy Pools | Tor |
| **other** | Misc `fetch` traffic | Tor |
| **rpc** | Your `RPC_URL` (chain reads & sends) | **Always clearnet** |

First Tor bootstrap may take a few seconds. Set `KOHAKU_TOR_DEBUG=1` if you need Tor client logs. Large Tor GETs (saga / artifacts) time out after `KOHAKU_TOR_CDN_TIMEOUT_MS` (default **45000**).

## Public-sync cache

Shared **Railgun Subsquid** and **Tornado saga** HTTP pages live under `<dataDir>/public-sync-cache` and speed up those syncs (`balances`, `shield`, `unshield`). Prefetch with [`fetch-sync-cache`](./fetch-sync-cache.html). Anything newer than the snapshot is still fetched live (Tor by default) and written through.

Privacy Pools is **not** covered. Wipe the cache with `kohaku clear-tor-cache --public-sync`.

## Proving artifacts cache

Railgun / Tornado proving keys live under `<dataDir>/proving-artifacts`. On **prove / unshield**, the CLI serves from that cache when present; otherwise it fetches over Tor from `KOHAKU_ARTIFACTS_BASE_URL` (default `https://artifacts.0000000000.org`) — and **fails** if Tor cannot complete the download. Event sync does **not** need these files.

Pre-warm with [`fetch-artifacts`](./fetch-artifacts.html) so unshields do not need a large Tor download mid-flow. Optionally use `kohaku fetch-artifacts --without-tor` for a **one-shot clearnet** download (that IP is then associated with fetching kohaku artifacts); later private ops still use Tor for everything else and read artifacts from disk.

You could also build the artifacts data dir manually if e.g. the kohaku artifacts url is down/censored.

## Disabling Tor

Only when you understand the tradeoff:

```bash
# per command
kohaku balances --include tornado --without-tor
kohaku unshield --next --amount-formatted 0.1 --without-tor

# or always
export KOHAKU_WITHOUT_TOR=1
```

Disabling Tor reveals your home IP to Pimlico and the other privacy-protocol endpoints above. Ethereum RPC was never on Tor either way.

## Tor bootstrap failures

If Tor fails to start (e.g. corrupted Arti cache / “Unable to bootstrap a working directory”), clear the on-disk cache and retry:

```bash
kohaku clear-tor-cache
```

The next Tor start re-downloads consensus (slower first bootstrap). To also wipe the public-sync HTTP cache:

```bash
kohaku clear-tor-cache --public-sync
```

## Auditing with `view-network-traffic`

Every contact is appended to `<dataDir>/<wallet>/network-traffic.ndjson` (API keys in URLs are redacted). Open the log:

```bash
kohaku view-network-traffic --wallet myWallet
```

Useful filters:

```bash
# only clearnet rows (RPC, --without-tor sessions, or local artifact cache hits)
kohaku view-network-traffic --wallet myWallet --clearnet-only

# only Tor rows
kohaku view-network-traffic --wallet myWallet --tor-only

# one category
kohaku view-network-traffic --wallet myWallet --category pimlico
kohaku view-network-traffic --wallet myWallet --category saga
kohaku view-network-traffic --wallet myWallet --category artifacts

# machine-readable
kohaku view-network-traffic --wallet myWallet --json

# wipe the log for this wallet
kohaku view-network-traffic --wallet myWallet --clear
```

In a TTY, the interactive viewer scrolls with `j`/`k` (or arrows); Tor rows are green, clearnet yellow, errors red. Use `--non-interactive` to dump to stdout without the UI.

RPC rows always show as clearnet — that is expected. Watch for unexpected clearnet hits to `pimlico`, `subsquid`, and friends (usually from `--without-tor` / `KOHAKU_WITHOUT_TOR=1`). Clearnet `artifacts` rows for **local cache** reads are normal after a successful `fetch-artifacts`.

## Related

- [Fetch Sync Cache](./fetch-sync-cache.html) — prefetch saga / Subsquid history
- [Fetch Artifacts](./fetch-artifacts.html) — pre-warm proving keys
- [Set Env](./env.html) — `RPC_URL`, `KOHAKU_WITHOUT_TOR`, sync-cache / artifact env vars
- [Full Commands Reference](./commands.html) — full `view-network-traffic` / `--without-tor` flag reference
- [Unshield Funds](./unshield.html) — why Pimlico traffic matters for withdrawals
