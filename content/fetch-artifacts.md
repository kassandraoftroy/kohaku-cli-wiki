---
title: Proving Artifacts
order: 22
section: appendix
summary: Proving circuits are bundled with kohaku-cli
---

Railgun, Tornado, and Privacy Pools proving circuits install with the CLI through the `kohaku-artifacts` package. **You do not need to fetch artifacts before proving or unshielding.** The old `fetch-artifacts` command was removed in v0.0.10.

The first `balances` / `shield` / `unshield` can still take time because it syncs **public pool history**. If you want that history ready on disk, run [`fetch-sync-cache`](./fetch-sync-cache.html). This cache is separate from the bundled proving circuits.

If a proving file is missing, check that the CLI installation and its dependencies completed successfully; rerun `npm install` and `npm run build` from the CLI repository. See [Install](./install.html).
