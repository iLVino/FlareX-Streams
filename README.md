# Pancake v4 hooks template

[`Use this Template`](https://github.com/new?owner=pancakeswap&template_name=pancake-v4-hooks-template&template_owner=pancakeswap)

## Prerequisite

1. Install foundry, see https://book.getfoundry.sh/getting-started/installation

## Running test

1. Install dependencies with `forge install`
2. Run test with `forge test --fork-url https://coston2-api.flare.network/ext/C/rpc`
3. Deploy with  `forge script script/DeployFtsoV2FeedConsumer.s.sol --rpc-url https://coston2-api.flare.network/ext/C/rpc --private-key $PRIVATE_KEY --broadcast`


## Description

This repository contains example counter hook for both CL and Bin pool types. 

