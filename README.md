# 🆙 universalprofile.cloud

[![Lint, Test, Build](https://github.com/lukso-network/universalprofile.cloud/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lukso-network/universalprofile.cloud/actions/workflows/ci.yml)

This dApp runs on [LUKSO](https://lukso.network/) network. It allows to:

- browse [Universal Profiles (UP)](https://docs.lukso.tech/learn/concepts#universal-profile)
- see UP associated assets (tokens and NFTs) and profile metadata
- see network activity
- connect and send assets
- buy native LYX token on LUKSO network

## 🚀 Deployments

This project is deployed via [Cloudflare pages](https://pages.cloudflare.com/).

### Preview

When you create a PR, a preview URL will be appended to the PR discussion.

### Production

Branch: `main`

- <https://universalprofile.cloud/>

## Fetch data mode

App supports data fetching through RPC or using GraphQL indexer. By default it uses Graph mode unless it's specified explicitly in env through `FETCH_DATA_PROVIDER=graph|rpc` variable. It can be also changed on per client basis using Local Storage `fetch-data-provider=graph|rpc` variable.

While RPC mode is more up-to-date but this comes at the cost of loading speed. It also limits amount of available features that are not possible in this mode.

## 🔌 Network switch

It is possible to pass a network in query parameter to force viewing a profile on a given network:

```text
?network=testnet
?network=mainnet
```

## Debug Logs

At runtime we look at the Local Storage "debug" key to show various logs. The following log streams are
available:

- `dapp:asset` -> Show asset objects
- `dapp:token` -> Show token objects
- `dapp:profile` -> Show profile objects
- `dapp:generic` -> Generic logs
- `dapp:send` -> Send logs
- `dapp:graph` -> GraphQL logs
- `tanstack:query` -> Show how queries as posted
- `tanstack:results` -> Show results of queries

You can use \* for any section or all. For example:

- `debug=\*`
- `debug=dapp:\*,tanstack:query`
- `debug=dapp:,tanstack:`

Use the Chrome debugger to add it to LocalStorage for the dApp site URL.

## 🧑🏻‍💻 Getting Started

Install packages:

```sh
yarn install
```

Run the development server:

```sh
yarn dev
```

Check the code:

```sh
yarn lint
yarn test
```

Preview the production build:

```sh
yarn preview
```

### Translations

App use [Yata](https://www.yatapp.net/), a third party website for managing translations. Do not edit `json` files for translations manually as they will be overwritten when fetching from Yata.

> Please first set `YATA_API_TOKEN` as an environment variable or locally in the root folder `.env` file (see `.env.example`).

For generating translations use following script:

```sh
yarn yata-fetch
```

### Using local [`tools-web-components`](https://github.com/lukso-network/tools-web-components)

This repo will look for `../tools-web-components/package` to turn on linking.

To link please run

```sh
yarn link -p ../tools-web-components/package
```

To unlink please run

```sh
yarn unlink ../tools-web-components/package
```

> Make sure you remove link before pushing, otherwise it won't build in Cloudflare.

### Releasing

We use single branch flow. Just merge your feature PR into `main` branch and new release will be triggered.
