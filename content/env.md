---
title: Set Env
order: 3
summary: Set the environment variables
---

Now that we've created a wallet. Let's configure the important environment variables.

> **Tip:** if you don't want to set the env vars in every new terminal session then you can add these lines to your `~/.bashrc` or `~/.zshrc`.

## Set DEFAULT_PRIVACY_PROTOCOL

This guide will focus on Tornado Cash as the main privacy solution. So simply execute:

```bash
export DEFAULT_PRIVACY_PROTOCOL=tornado
```

This is a convenience environment variable, setting a single privacy protocol as the "default" to display balances for and interact with (so you don't have to use `--protocol` or `--include` for every command).

If you want to use Railgun or Privacy Pools (V1) as the "default" protocol, simply set as `railgun` or `privacy-pools`.

## Set RPC_URL

We need an Ethereum `RPC_URL`. Ideally, this is your **local node**

```bash
export RPC_URL=http://localhost:8545
```

(this is the default so if your node is `localohst:8545` the var doesn't even need to be explicitly set)

Everything else the CLI contacts (Pimlico, Subsquid, PPOI, saga, proving artifacts, ASP/fastrelay, …) goes through **Tor by default**. The Ethereum RPC is the deliberate exception: it stays on clearnet. That is fine when the RPC is local. If you use a remote provider instead, assume it can see which addresses you query and may already identify you via an API key — Tor would not help much there anyway. Details: [Network traffic](./network-traffic.html).

If you must use a remote RPC provider (Alchemy, Infura, Ankr, etc):

```bash
export RPC_URL=https://rpc.ankr.com/eth/some-api-key
```

You are then entrusting that provider with privacy-critical information (addresses you query, how they cluster together, network metadata). Prefer a local node when you can OR a local process that can mirror local node functionality (a project i hope to work on!)

## Recommended: public-sync cache

The first Tornado / Railgun sync (`balances`, `shield`, `unshield`) pages a lot of **public** history over the network (saga CDN + Railgun Subsquid). Prefetch that snapshot now to make first protocol **syncs significantly faster** :

```bash
kohaku fetch-sync-cache
```

This is the more important setup step — event sync does **not** need proving keys. Details: [`fetch-sync-cache`](./fetch-sync-cache.html).

Cache lives under `<dataDir>/public-sync-cache`. Wipe with `kohaku clear-tor-cache --public-sync`.

## Optional: proving artifacts

Railgun / Tornado **proving keys** cache under `<dataDir>/proving-artifacts`. You need them later for prove / unshield — not for the first `balances` sync. Load them with [`fetch-artifacts`](./fetch-artifacts.html).

(While setting everything up, now is also a good time to run [`fetch-artifacts`](./fetch-artifacts.html) so those keys are on disk before you unshield.)

## Optional: `KOHAKU_WITHOUT_TOR`

Tor is **on** by default for non-RPC HTTP. There is **no Tor→clearnet fallback** for saga CDN or proving artifacts — those fail if Tor cannot complete the request (unless you explicitly disable Tor). Set this to always skip Tor without passing `--without-tor` on every command:

```bash
export KOHAKU_WITHOUT_TOR=1
```

Default is unset / `0` (Tor on). Only disable Tor when you understand you are revealing your home IP to Pimlico and other privacy-protocol endpoints — see [Network traffic](./network-traffic.html).

## Optional: `KOHAKU_GETLOGS_MAX_BLOCK_SPAN`

Some RPCs limit how large an `eth_getLogs` block range they accept. The CLI defaults to **499**. Raise or lower it to match what your node / provider allows:

```bash
export KOHAKU_GETLOGS_MAX_BLOCK_SPAN=499
```

## Data directory

Wallet data lives in `~/.kohaku-cli` by default. To use a different location,
pass `--dataDir <path>` on **every** command — there is no persistent config
that remembers a custom data directory.
