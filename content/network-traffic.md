---
title: Network Traffic
order: 23
section: appendix
summary: Tor vs clearnet — what the CLI contacts and how to audit it
---

By default, **all non-RPC network traffic** from the CLI goes through [Tor](https://github.com/privacy-ethereum/tor-js). The Ethereum RPC is the exception: it stays on clearnet, because it is hopefully a **local node** — and if it is not, a remote provider URL usually already carries an identifying API key anyway (public RPC endpoints are not strong enough to handle the amount of requests needed by the CLI)

There is **no Tor→clearnet fallback** for saga CDN requests (unless you explicitly pass `--without-tor` / set `KOHAKU_WITHOUT_TOR=1`). Proving circuits are bundled with the CLI and are not downloaded at prove time.

## What goes over Tor

When you run `balances` (with private protocols), `shield`, `unshield`, `private-transfer`, `ragequit`, `transfer`, `transact-raw`, name commands, Tornado note import/export, or `fetch-sync-cache`, the CLI may contact:

| Category | Examples | Path |
|---|---|---|
| **pimlico** | Bundler / paymaster for Tornado, Privacy Pools, and Railgun UserOps | Tor (most critical for IP privacy) |
| **subsquid** | Railgun indexer | Tor |
| **ppoi** | Railgun PPOI | Tor |
| **saga** | Tornado / Privacy Pools (mainnet) saga CDN | Tor-or-fail (no clearnet fallback) |
| **asp** | Privacy Pools ASP | Tor |
| **other** | Misc `fetch` traffic | Tor |
| **rpc** | Your `RPC_URL` (chain reads & sends) | **Always clearnet** |

First Tor bootstrap may take a few seconds. Set `KOHAKU_TOR_DEBUG=1` if you need Tor client logs. Large saga GETs time out after `KOHAKU_TOR_CDN_TIMEOUT_MS` (default **45000**).

## Public-sync cache

On mainnet, [`fetch-sync-cache`](./fetch-sync-cache.html) installs verified Railgun history, historical PPOI leaves, and Tornado / Privacy Pools Saga data under `<dataDir>/sync-cache-v2`. Later blocks and PPOI root/status/tip checks still use live sources (Tor by default). Sepolia keeps its existing live sync path.

The old `<dataDir>/public-sync-cache` is no longer read. `kohaku clear-tor-cache --public-sync` removes both cache directories.

## Proving circuits

Railgun, Tornado, and Privacy Pools circuits come from the `kohaku-artifacts` dependency installed with the CLI. Proving and unshielding do not fetch circuit files. There is no `fetch-artifacts` command anymore.

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

The next Tor start re-downloads consensus (slower first bootstrap). To also wipe the v2 snapshot and old public-sync cache:

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
# only clearnet rows (RPC or --without-tor sessions)
kohaku view-network-traffic --wallet myWallet --clearnet-only

# only Tor rows
kohaku view-network-traffic --wallet myWallet --tor-only

# one category
kohaku view-network-traffic --wallet myWallet --category pimlico
kohaku view-network-traffic --wallet myWallet --category saga

# machine-readable
kohaku view-network-traffic --wallet myWallet --json

# wipe the log for this wallet
kohaku view-network-traffic --wallet myWallet --clear
```

In a TTY, the interactive viewer scrolls with `j`/`k` (or arrows); Tor rows are green, clearnet yellow, errors red. Use `--non-interactive` to dump to stdout without the UI.

RPC rows always show as clearnet — that is expected. Watch for unexpected clearnet hits to `pimlico`, `subsquid`, and friends (usually from `--without-tor` / `KOHAKU_WITHOUT_TOR=1`).

## Related

- [Fetch Sync Cache](./fetch-sync-cache.html) — prefetch verified mainnet protocol history
- [Set Env](./env.html) — `RPC_URL`, `KOHAKU_WITHOUT_TOR`, sync-cache env vars
- [Full Commands Reference](./commands.html) — full `view-network-traffic` / `--without-tor` flag reference
- [Unshield Funds](./unshield.html) — why Pimlico traffic matters for withdrawals
