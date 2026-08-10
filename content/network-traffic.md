---
title: Network Traffic
order: 19
section: appendix
summary: Tor vs clearnet — what the CLI contacts and how to audit it
---

By default, **all non-RPC network traffic** from the CLI goes through [Tor](https://github.com/privacy-ethereum/tor-js). The Ethereum RPC is the exception: it stays on clearnet, because it is hopefully a **local node** — and if it is not, a remote provider URL usually already carries an identifying API key anyway.

## What goes over Tor

When you run `balances` (with private protocols), `shield`, or `unshield`, the CLI may contact:

| Category | Examples | Path |
|---|---|---|
| **pimlico** | Bundler / paymaster for Tornado and Railgun unshields | Tor (most critical for IP privacy) |
| **subsquid** | Railgun indexer | Tor |
| **ppoi** | Railgun PPOI | Tor |
| **saga** | Tornado saga CDN | Tor first, then clearnet fallback |
| **artifacts** | Proving artifacts (often from GitHub) | Tor first, then clearnet fallback |
| **asp** / **fastrelay** | Privacy Pools | Tor |
| **other** | Misc `fetch` traffic | Tor |
| **rpc** | Your `RPC_URL` (ethers / chain reads & sends) | **Always clearnet** |

First Tor bootstrap may take a few seconds. Set `KOHAKU_TOR_DEBUG=1` if you need Tor client logs.

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

## CDN / artifacts fallback (saga + GitHub)

**Saga CDN** (Tornado historical state) and proving **artifacts** (often from GitHub) try Tor first. If that path hangs or fails, the CLI **falls back to clearnet for those downloads only**, rather than failing the whole operation. Everything else still prefers Tor (unless you disabled it). In the traffic log these show up as `saga-fallback` / `artifact-fallback` (or clearnet rows under `saga` / `artifacts`).

That fallback is intentional: these hosts often block or break Tor exits. Timeout defaults to 45s (`KOHAKU_TOR_CDN_TIMEOUT_MS` to override).

### First `balances` after a fresh wallet

Tor is especially likely to fail on the **first sync** of a new wallet when pulling **historical Tornado state** from the saga CDN. Expect that first `kohaku balances --include tornado` (or with `DEFAULT_PRIVACY_PROTOCOL=tornado`) may include **clearnet CDN calls** that leak IP / network metadata to the saga host.

If you are highly privacy-conscious: run that first sync behind a **VPN** (or accept the metadata leak), then review with `view-network-traffic --clearnet-only`. Later syncs are usually smaller and less likely to need the fallback.

## Auditing with `view-network-traffic`

Every contact is appended to `<dataDir>/<wallet>/network-traffic.ndjson` (API keys in URLs are redacted). Open the log:

```bash
kohaku view-network-traffic --wallet myWallet
```

Useful filters:

```bash
# only clearnet rows (RPC, saga/artifact fallbacks, or --without-tor sessions)
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

RPC rows always show as clearnet — that is expected. Watch for unexpected clearnet hits to `pimlico`, `subsquid`, and friends (usually from `--without-tor` / `KOHAKU_WITHOUT_TOR=1`), and clearnet `saga` / `artifacts` after Tor timeouts — especially on the first Tornado `balances` sync.

## Related

- [Set Env](./env.html) — `RPC_URL`, `KOHAKU_WITHOUT_TOR`, `KOHAKU_GETLOGS_MAX_BLOCK_SPAN`
- [Full Commands Reference](./commands.html) — full `view-network-traffic` / `--without-tor` flag reference
- [Unshield Funds](./unshield.html) — why Pimlico traffic matters for withdrawals
