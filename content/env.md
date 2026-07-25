---
title: Set Env
order: 3
summary: Set the environment variables
---

Now that we've created a wallet. Let's configure the important environment variables.

> **Tip:** if you don't want to set the env vars in every new terminal session then you can add these lines to your `~/.bashrc` or `~/.zshrc`.

### Set DEFAULT_PRIVACY_PROTOCOL

This is a convenience environment variable, picking a single privacy protocol as the "default" to display balances for and interact with. This guide will focus on Tornado Cash as the example. So simply execute:

```bash
export DEFAULT_PRIVACY_PROTOCOL=tornado
```

If you want to use Railgun or Privacy Pools (V1) as the "default" protocol, simply set as `railgun` or `privacy-pools`.

## Set RPC_URL

We need an Ethereum `RPC_URL` . Ideally, this is your local node and gives you the cleanest privacy properties.

```bash
export RPC_URL=http://localhost:8545
```

If not you can use a remote RPC provider (Alchemy, Infura, Ankr, etc) URL. But _crucially_, you are now entrusting the RPC provider with privacy critical information (e.g. the ethereum addresses you query, linking them together).

example:

```bash
export RPC_URL=https://rpc.ankr.com/eth/some-api-key
```

## Data directory

Wallet data lives in `~/.kohaku-cli` by default. To use a different location,
pass `--dataDir <path>` on **every** command — there is no persistent config
that remembers a custom data directory.
