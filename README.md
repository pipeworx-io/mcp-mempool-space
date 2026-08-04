# @pipeworx/mempool-space

mempool.space MCP — Bitcoin block explorer + mempool / fee statistics. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `recommended_fees()` — sat/vB fee recommendations (fastest / half-hour / hour / economy / minimum)
- `mempool_stats()` — current mempool size + tx count + total fees
- `block_height()` — current chain tip
- `get_block(hash_or_height)` — block detail
- `get_transaction(txid)` — transaction detail
- `get_tx_status(txid)` — confirmation state
- `get_address(address)` — UTXO + tx-count summary
- `get_address_transactions(address, limit?)` — recent transactions
- `hashrate(period?)` — hashrate / difficulty history
- `mining_pools(period?)` — block share by mining pool

## Networks

- Bitcoin mainnet (default)
- Pass `network: "testnet"` for testnet or `"signet"` for signet
- Pass `network: "liquid"` for Liquid sidechain

## Data source

`https://mempool.space/api/` (and per-network sub-paths).

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mempool-space": {
      "url": "https://gateway.pipeworx.io/mempool-space/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Mempool Space data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
