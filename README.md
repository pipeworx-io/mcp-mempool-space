# mcp-mempool-space

mempool.space MCP — Bitcoin block explorer + mempool/fee stats

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `recommended_fees` | Current sat/vB fee recommendations. |
| `mempool_stats` | Current mempool size + tx count + total fees. |
| `block_height` | Current chain tip block height. |
| `get_block` | Block detail by hash or height. |
| `get_transaction` | Transaction detail. |
| `get_tx_status` | Confirmation state. |
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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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
