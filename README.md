# @pipeworx/mempool-space

mempool.space MCP — Bitcoin block explorer + mempool / fee statistics. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/mempool-space/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Mempool Space data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/recommended_fees \
  -H 'Content-Type: application/json' \
  -d '{"network":"mainnet"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/recommended_fees`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
