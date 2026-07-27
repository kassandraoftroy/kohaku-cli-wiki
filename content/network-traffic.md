---
title: Network Traffic
order: 17
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
| **saga** | Tornado saga CDN | Tor |
| **artifacts** | Proving artifacts (often from GitHub) | Tor first |
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

## GitHub artifacts fallback

Proving **artifacts** (often fetched from GitHub) try Tor first. If that path fails, the CLI **falls back to clearnet for those artifact downloads only**, rather than failing the whole operation. Everything else still prefers Tor (unless you disabled it).

That fallback is intentional: artifact hosts sometimes block or break Tor exits. It means a clearnet fetch of static proving files can happen — review it in the traffic log if that matters to you.

## Auditing with `view-network-traffic`

Every contact is appended to `<dataDir>/<wallet>/network-traffic.ndjson` (API keys in URLs are redacted). Open the log:

```bash
kohaku view-network-traffic --wallet myWallet
```

Useful filters:

```bash
# only clearnet rows (RPC, or artifact fallbacks, or --without-tor sessions)
kohaku view-network-traffic --wallet myWallet --clearnet-only

# only Tor rows
kohaku view-network-traffic --wallet myWallet --tor-only

# one category
kohaku view-network-traffic --wallet myWallet --category pimlico
kohaku view-network-traffic --wallet myWallet --category artifacts

# machine-readable
kohaku view-network-traffic --wallet myWallet --json

# wipe the log for this wallet
kohaku view-network-traffic --wallet myWallet --clear
```

In a TTY, the interactive viewer scrolls with `j`/`k` (or arrows); Tor rows are green, clearnet yellow, errors red. Use `--non-interactive` to dump to stdout without the UI.

RPC rows always show as clearnet — that is expected. What you want to watch for is unexpected clearnet hits to `pimlico`, `subsquid`, and friends (usually from `--without-tor` / `KOHAKU_WITHOUT_TOR=1`), and occasional clearnet `artifacts` after a Tor failure.

## Related

- [Set Env](./env.html) — `RPC_URL`, `KOHAKU_WITHOUT_TOR`, `KOHAKU_GETLOGS_MAX_BLOCK_SPAN`
- [Full Commands Reference](./commands.html) — full `view-network-traffic` / `--without-tor` flag reference
- [Unshield Funds](./unshield.html) — why Pimlico traffic matters for withdrawals
