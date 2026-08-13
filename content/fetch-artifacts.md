---
title: Fetch Artifacts
order: 20
section: appendix
summary: Pre-download Railgun + Tornado proving keys into the local cache
---

Shield / unshield / private sync need **proving artifacts** (circuit keys). From 0.0.3 those live under `<dataDir>/proving-artifacts` (default `~/.kohaku-cli/proving-artifacts`). When a file is missing, the CLI fetches it over **Tor** from `KOHAKU_ARTIFACTS_BASE_URL` — and **fails** if Tor cannot complete the download (no clearnet fallback).

`fetch-artifacts` pre-warms that cache so later private ops prove from disk.

## Full set (recommended once)

```bash
kohaku fetch-artifacts
```

Downloads the full Railgun modern `.br` set (transact + POI) plus Tornado circuit/key — roughly **~260 MB**. Default route is Tor.

## One-shot clearnet download

If Tor is slow or unreliable for large GETs, you can fetch over clearnet **once**, then keep Tor on for all subsequent private ops:

```bash
kohaku fetch-artifacts --without-tor
```

That associates your IP with downloading kohaku proving artifacts. Afterward, shield/unshield/sync read from the local cache and stay Tor-only for other HTTP (except RPC). See [Network traffic](./network-traffic.html).

## Narrow the download

```bash
# Tornado only
kohaku fetch-artifacts --tornado

# Specific Railgun variants + Tornado
kohaku fetch-artifacts --variant 01x03 --poi 03x03 --tornado

# Explicit relative key
kohaku fetch-artifacts railgun/01x03/proving_key.bin.br
```

| Option / args | Description |
|---|---|
| *(none)* | Full Railgun modern `.br` set + Tornado circuit/key |
| `--variant <NNxMM>` | Railgun transact variant(s), e.g. `01x03` (repeatable) |
| `--poi <NNxMM>` | POI variant(s): `03x03` or `13x13` (repeatable) |
| `--tornado` | Tornado circuit JSON + proving key only |
| `[keys...]` | Explicit relative paths under the artifacts tree |
| `--without-tor` | Download over clearnet |
| `--dataDir <path>` | Data root (cache at `<dataDir>/proving-artifacts`) |
| `--non-interactive` | JSON summary only |

Remote base URL: env `KOHAKU_ARTIFACTS_BASE_URL` (default `https://artifacts.0000000000.org`). Large Tor GETs: `KOHAKU_TOR_CDN_TIMEOUT_MS` (default `45000`).

## When to run it

- After a fresh install / new data directory, **before** the first `balances --include …` / `shield` / `unshield` that needs proofs
- After clearing or moving `--dataDir`
- When a private op fails with an artifact download / Tor CDN timeout — fix Tor (`clear-tor-cache` if needed) or re-run `fetch-artifacts`

## Related

- [Network Traffic](./network-traffic.html) — Tor-or-fail policy
- [Set Env](./env.html) — artifact / Tor env vars
- [Full Commands Reference](./commands.html) — full flag list
