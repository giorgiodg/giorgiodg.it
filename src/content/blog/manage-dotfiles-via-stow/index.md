---
title: "Stop copy-pasting. Manage dotfiles with Stow"
description: "Keep your config files in one repo and deploy them anywhere in seconds using GNU Stow."
date: "Sep 15 2026"
tags: ["cli", "dotfiles", "productivity", "development"]
draft: false
---

Most development setups start simple and drift over time. Config files end up scattered across your home directory, often slightly different on each machine.

A new laptop means reinstalling and reconfiguring everything. Small but crucial settings, like a **Vim theme** or **VS Code keybindings**, don’t consistently make it across environments. And once you’re working across two or more machines, this becomes friction day-in day-out.

Having a dotfiles repo definitely helps, but you still need to to manually place files in the right locations.

Here comes GNU Stow into play, helping you manage dotfiles through a simple, mirrored folder structure.
Stow works like a symlink manager. It lets you keep your configuration in a single directory and map it into your home directory using symlinks.

## Check the structure for your dotfiles repo

Structure each tool config to mirror the real filesystem. For instance, Ghostty stores its config at 

`~/.config/ghostty/config`

then your module should have this structure

```bash
dotfiles/
└── ghostty/.config/ghostty/config
```

Speaking of Vim, whose config lives at

```bash
~/.vimrc
```

then your module should be

```bash
dotfiles/
└── vim/.vimrc
```

The overall structure would then result into

```bash
dotfiles/
├── vim/.vimrc
├── ghostty/.config/ghostty/config
└── [...]
```

## Setup

Install Stow:

```bash
# macOS
brew install stow

# Debian/Ubuntu
apt install stow
```

Execute:

```bash
stow -t ~ vim ghostty
```

Add `-t ~` to specify the target directory to be your home dir. Default is the parent of stow dir.

This creates:

- `~/.vim` → `dotfiles/vim/.vim`
- `~/.config/ghostty/config` → `dotfiles/ghostty/.config/ghostty/config`

Your system reads these as normal files but the actual source lives in your dotfiles repo.

Edit as usual, and since the files live inside your repository, changes are immediately visible to git.

Verify:

```bash
ls -l ~/.config/ghostty/config
# ~/.config/ghostty/config -> ~/dotfiles/ghostty/.config/ghostty/config
```

If a file already exists, Stow will not overwrite it. Remove or move the file before running the command.

## New Machine

```bash
git clone https://github.com/your_repo/dotfiles.git
cd dotfiles
stow -t ~ vim zsh ghostty git vscode
```

Your environment is reconstructed in seconds, with no manual copying.

## Undo

```bash
stow -D -t ~ ghostty
```

The `-D` flag removes symlinks created by Stow.

## Common Patterns

Stow everything:

```bash
stow -t ~ */
```

Use this when your modules are cleanly separated and you want a full setup.

Ignore files:

Add a `.stow-ignore` file inside a module:

```text
^\.DS_Store$
^\.git/$
```

## Why Stow

If you're looking sto scale your configurations across machines, Stow combined with dotfiles make your life easier.

More info on the official page: [GNU Stow](https://www.gnu.org.cach3.com/s/stow/index.html)