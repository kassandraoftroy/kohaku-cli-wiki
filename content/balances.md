---
title: Check Balances
order: 6
summary: See public and private balances
---

```bash
kohaku balances
```

You will pick your wallet (if you have more than one), enter the password, and wait for a short sync.

The **first** Tornado / Railgun sync can take a while (paging saga / Subsquid history). Prefetch that snapshot once with [`fetch-sync-cache`](./fetch-sync-cache.html) so most of it comes from disk; later runs only catch up what is new. Privacy Pools **mainnet** history comes from its own saga CDN (sealed chunks are cached on the way); Sepolia Privacy Pools still uses bundled state + `eth_getLogs`.

Sync progress now shows a separate bar for each step whose size is known (saga chunks, RPC windows, and stealth blocks). A quiet stretch can still say it is working while the elapsed time keeps moving. The Sepolia Privacy Pools bundled snapshot was updated in v0.0.11, so first sync starts from a later block.

You should see:

- **Public** — ETH / ERC20 tokens sitting on your addresses, potentially linked to whoever sent them. (Only the top 25-50 tokens show up automatically you can scan for custom tokens with a `--tokens` flag)
- **Private** — what you have already shielded (with `DEFAULT_PRIVACY_PROTOCOL=tornado`, this is your Tornado balance)

For a per-address breakdown:

```bash
kohaku balances --verbose
```

If you would like to see private blances from other protocols than your default, or multiple privacy protocols at once:

```bash
kohaku balances --include privacy-pools,tornado
```

## Reading the result

- Fresh deposits show up under **Public** until you shield them
- After a successful [shield](./shield.html), public balance drops and private (Tornado) balance rises
- After an [unshield](./unshield.html), private drops and a (hopefully fresh) public address receives funds

If a deposit is missing, wait for more confirmations and run `balances` again. Also double-check you are on the right wallet and that `RPC_URL` points at right network.

Older Tornado and Privacy Pools notes show as **legacy** when present. They remain spendable alongside newer signature-derived notes, though a single withdrawal uses one scheme. Tornado balances include the new ETH denominations even when you use `--exclude-new-pools` on shield, unshield, or private-transfer.
