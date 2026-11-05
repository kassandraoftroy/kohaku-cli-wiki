---
title: Check Balances
order: 6
summary: See public and private balances
---

```bash
kohaku balances
```

You will pick your wallet (if you have more than one), enter the password, and wait for a short sync.

The **first** private sync can take a while. On mainnet, prefetch Railgun, Tornado, and Privacy Pools history with [`fetch-sync-cache`](./fetch-sync-cache.html) so most historical work comes from disk; live state still catches up afterward. Sepolia keeps its existing sync path.

Independent private protocols sync concurrently. Progress shows the current phases and bars for work whose size is known (such as saga chunks, RPC windows, and cached PPOI leaves); remaining-time estimates count down as work proceeds. A quiet stretch can still say it is working. The Sepolia Privacy Pools bundled snapshot was updated in v0.0.11, so first sync starts from a later block.

Successful private balance checks are saved in an encrypted wallet-local display cache for up to one minute. Cached sections show how long ago they were checked; non-interactive JSON includes `private_balance_freshness`. To check private balances again now, run:

```bash
kohaku balances --include railgun,privacy-pools,tornado --refresh
```

Changes to wallet identity, protocol storage, or operation activity invalidate cached views. Spending commands always use their normal sync path. Public balances are still fetched on every `balances` run; when every requested private view is recent, the CLI skips private wallet initialization and Tor bootstrap.

You should see:

- **Public** — ETH / ERC20 tokens sitting on your addresses, potentially linked to whoever sent them. (Default tokens show up automatically; scan custom tokens with `--tokensList`.)
- **Private** — what you have already shielded (with `DEFAULT_PRIVACY_PROTOCOL=tornado`, this is your Tornado balance)

For a per-address breakdown:

```bash
kohaku balances --verbose
```

If you would like to see private blances from other protocols than your default, or multiple privacy protocols at once:

```bash
kohaku balances --include privacy-pools,tornado
```

`kohaku balances --include railgun` also shows your full Railgun `0zk` address. Non-interactive JSON includes it as `railgun_address`.

If Railgun history sync succeeds but its POI refresh fails, the balance remains visible with `[ERR: POI data missing]`; affected funds cannot be spent until POI refresh succeeds. JSON records the error under `private_balance_freshness.railgun.poiError`.

## Reading the result

- Fresh deposits show up under **Public** until you shield them
- After a successful [shield](./shield.html), public balance drops and private (Tornado) balance rises
- After an [unshield](./unshield.html), private drops and a (hopefully fresh) public address receives funds

If a deposit is missing, wait for more confirmations and run `balances` again. Also double-check you are on the right wallet and that `RPC_URL` points at right network.

Older Tornado and Privacy Pools notes show as **legacy** when present. They remain spendable alongside newer signature-derived notes, though a single withdrawal uses one scheme. Tornado balances include the new ETH denominations even when you use `--exclude-new-pools` on shield, unshield, or private-transfer.
