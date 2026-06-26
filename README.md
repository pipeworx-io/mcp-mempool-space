# mcp-mempool-space

mempool.space MCP — Bitcoin block explorer + mempool/fee stats

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 965+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `recommended_fees` | Current sat/vB fee recommendations. |
| `mempool_stats` | Current mempool size + tx count + total fees. |
| `block_height` | Return the current chain tip block height (latest mined block number) for mainnet, testnet, signet, or liquid. |
| `get_block` | Block detail by hash or height. |
| `get_transaction` | Fetch full transaction detail (inputs, outputs, fee, size, confirmation status) for a given txid on mainnet/testnet/signet/liquid. |
| `get_tx_status` | Return confirmation status (confirmed, block hash, block height) for a txid without fetching the full transaction body. |
| `get_address` | Address summary (UTXO + tx counts). |
| `get_address_transactions` | Recent transactions for an address (~25 per call). |
| `hashrate` | Network hashrate + difficulty history. |
| `mining_pools` | Block share by mining pool. |

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

Or connect to the full Pipeworx gateway for access to all 965+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
