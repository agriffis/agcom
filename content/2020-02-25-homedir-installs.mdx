---
title: Working from $HOME
excerpt: Homedir install quickref
author: Aron
tags: [node, python, ruby, go]
layout: article
---

Sometimes there's a tool I need, but I'd rather not install it globally. What
follows here is a quick reference for installing to my home directory from
various sources.

This `PATH` setting covers everything below:

    PATH=~/bin:~/.local/bin:$PATH

Regarding `~/bin` versus `~/.local/bin`, the latter is where I install
third-party software, and the former is my personal scripts and wrappers.


## Node with npm

Install node with `dnf install node` (Fedora) or `brew install node` (macOS).

npm has two installation modes:
[local](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
and
[global](https://docs.npmjs.com/getting-started/installing-npm-packages-globally).
Local mode installs in `node_modules` under the current working directory,
especially for projects with dependencies managed by `package.json`. Global
mode normally installs to `/usr` or `/usr/local` which requires sudo, but
you can configure it to install to your home directory instead:

    $ npm config set prefix '${HOME}/.local'

Installing [prettier](https://prettier.io/), the opinionated code formatter:

    $ npm install -g prettier

This installs the package in `~/.local/lib/node_modules/prettier` and
creates a symlink at `~/.local/bin/prettier` for running it:

    $ which prettier
    ~/.local/bin/prettier

    $ prettier --version
    1.19.1

Upgrade with `npm update -g prettier`, and uninstall with `npm uninstall -g
prettier`


## Node with yarn

I'm not sure there's a good reason to use yarn for global installs instead of
npm, but for reference...

After preparing npm above, install yarn with `npm i -g yarn`

yarn has the same local/global modes as npm, and similarly, you can
override the global installation dir:

    $ yarn config set prefix '${HOME}/.local'

Installing [cssunminifier](https://github.com/mrcoles/cssunminifier):

    $ yarn global add cssunminifier

This installs the package in
`~/.config/yarn/global/node_modules/cssunminifier` but it creates a symlink
in `~/.local/bin` according to the configured prefix, so the end result is
largely the same as npm:

    $ which cssunminifier
    ~/.local/bin/cssunminifier

    $ cssunminifier --version
    cssunminifier 0.0.1 (CSS Unminifier) [JavaScript]

Upgrade is `yarn global upgrade cssunminifier`, and uninstall is `yarn global
remove cssunminifier`


## Python with pip

pip accepts `--user` to install to your home directory. Note that if you have
`pip3` available, you probably want to use that instead, but some packages are
still only available for Python 2. You can mix and match because they install to
versioned directories:

    $ python2 -c 'import site; print(site.USER_SITE)'
    /home/aron/.local/lib/python2.7/site-packages

    $ python3 -c 'import site; print site.USER_SITE'
    /home/aron/.local/lib/python3.7/site-packages

On my Linux system, `pip3 install --user` makes executables available at
`~/.local/bin` but on Mac the executables land in a versioned directory:
`~/Library/Python/3.7/bin`. For now, I'm working around this by setting up
a symlink in advance:

    $ mkdir -p ~/.local/bin
    $ mv ~/Library/Python/3.7/bin/* ~/.local/bin/
    $ rmdir ~/Library/Python/3.7/bin
    $ ln -sv ~/.local/bin ~/Library/Python/3.7/bin
    /Users/aron/Library/Python/3.7/bin -> /Users/aron/.local/bin

Installing [black](https://black.readthedocs.io/en/stable/), the uncompromising
code formatter:

    $ pip3 install --user black

    $ which black
    ~/.local/bin/black

    $ black --version
    black, version 19.10b0

Upgrade is `pip3 install --user --upgrade` and uninstall is `pip3 uninstall`
(without `--user`)


## Ruby with gem

gem accepts `--user-install` to install to your home directory. Unfortunately on
Fedora the executable lands in `~/bin` which is my personal scripts area--I'd
rather install packages to `~/.local/bin`. On Mac the executable lands in
`~/.gem/ruby/2.6.0/bin` which isn't on my `PATH`.

The easy fix is the following line in `~/.gemrc`:

    gem: --user-install --bindir ~/.local/bin

Installing [rubocop](https://rubocop.readthedocs.io/en/latest/), the Ruby
linter:

    $ gem install rubocop

    $ which rubocop
    ~/.local/bin/rubocop

    $ rubocop --version
    0.80.0

Upgrade is `gem update rubocop` and uninstall is `gem uninstall rubocop`


## Rust with cargo

Install rust to your home directory with [rustup](https://rustup.rs). You can
also use dnf or brew, but rustup provides a more recent compiler, even nightly
if you want it.

Regardless how Rust is installed, `cargo` installs to `~/.cargo` by default,
with executables in `~/.cargo/bin`. This isn't a versioned directory, but
I really prefer to use `~/.local/bin`, so I make the symlink:

    $ mkdir -p ~/.local/bin
    $ mv ~/.cargo/bin/* ~/.local/bin
    $ rmdir ~/.cargo/bin
    $ ln -sv ~/.local/bin ~/.cargo/bin
    /home/aron/.cargo/bin -> /home/aron/.local/bin

Installing [ripgrep](https://github.com/BurntSushi/ripgrep), the really fast
recursive grep:

    $ cargo install ripgrep
    Installed package `ripgrep v11.0.2` (executable `rg`)

    $ which rg
    ~/.local/bin/rg

    $ rg --version
    ripgrep 11.0.2


## Go with go get

Go installs in `~/go` by default, but you can keep it out of your visible home
directory by directing it to a different location, with binaries in the
converged bin-dir for convenience:

    $ go env -w GOPATH=$HOME/.go
    $ go env -w GOBIN=$HOME/.local/bin

That writes to `~/.config/go/env` which the go command reads. Alternatively you
can set these in your shell profile--it's up to you.

Installing [elvish](https://elv.sh/), the friendly interactive shell:

    $ go get -u github.com/elves/elvish

    $ which elvish
    ~/.local/bin/elvish

    $ elvish
    ~> █





