---
title: Install
order: 1
summary: Install kohaku-cli on your machine
---

There is no packaged installer yet, so you have to build `kohaku-cli` from source.

## Clone and build

```bash
git clone https://github.com/kassandraoftroy/kohaku-cli.git
cd kohaku-cli
npm install
npm run build
```

(requires **Node.js 22+**)

At this point you _could_ simply use `npm run dev:prod --` as the prefix to commands (e.g. `npm run dev:prod -- --version`) but you can only invoke the kohaku-cli from inside the root folder of the repo.

To use the `kohaku` command and to invoke the CLI from anywhere on your machine, proceed to the next step. 

## Put `kohaku` on your PATH

From the `kohaku-cli` root directory, after building, just copy or symlink `bin/kohaku.mjs` somewhere on your `PATH` as `kohaku`.

**Linux**

```bash
ln -sf "$(pwd)/bin/kohaku.mjs" ~/.local/bin/kohaku
```

**macOS**

```bash
sudo ln -sf "$(pwd)/bin/kohaku.mjs" /usr/local/bin/kohaku
```

Writing `kohaku` file to any directory on your PATH works.

Check:

```bash
kohaku --version
```

> **Tip:** Add the target directory to your PATH in `~/.bashrc` or `~/.zshrc`
> by just adding a line to the bottom of the file. E.g. add 
> `~/.local/bin` to the path with:
> ```bash
> export PATH="$HOME/.local/bin:$PATH"
> ```
> Then either close and reopen your terminal, or run e.g. `source ~/.bashrc`

## Update

Note that to update the CLI you need to sync with latest `main` branch of the repository and and repeat these steps.



