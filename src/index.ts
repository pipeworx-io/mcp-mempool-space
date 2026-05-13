interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * mempool.space MCP — Bitcoin block explorer + mempool/fee stats
 *
 * Auth: none.
 * Docs: https://mempool.space/docs/api/rest
 */


const NETWORKS: Record<string, string> = {
  mainnet: 'https://mempool.space/api',
  testnet: 'https://mempool.space/testnet/api',
  signet: 'https://mempool.space/signet/api',
  liquid: 'https://liquid.network/api',
};

function networkBase(args: Record<string, unknown>): string {
  const net = ((args.network as string | undefined) ?? 'mainnet').toLowerCase();
  const base = NETWORKS[net];
  if (!base) throw new Error(`Unsupported network "${net}". Supported: ${Object.keys(NETWORKS).join(', ')}.`);
  return base;
}

const tools: McpToolExport['tools'] = [
  {
    name: 'recommended_fees',
    description: 'Current sat/vB fee recommendations.',
    inputSchema: { type: 'object', properties: { network: { type: 'string' } } },
  },
  {
    name: 'mempool_stats',
    description: 'Current mempool size + tx count + total fees.',
    inputSchema: { type: 'object', properties: { network: { type: 'string' } } },
  },
  {
    name: 'block_height',
    description: 'Current chain tip block height.',
    inputSchema: { type: 'object', properties: { network: { type: 'string' } } },
  },
  {
    name: 'get_block',
    description: 'Block detail by hash or height.',
    inputSchema: {
      type: 'object',
      properties: {
        hash_or_height: { type: 'string', description: 'Block hash or numeric height' },
        network: { type: 'string' },
      },
      required: ['hash_or_height'],
    },
  },
  {
    name: 'get_transaction',
    description: 'Transaction detail.',
    inputSchema: {
      type: 'object',
      properties: { txid: { type: 'string' }, network: { type: 'string' } },
      required: ['txid'],
    },
  },
  {
    name: 'get_tx_status',
    description: 'Confirmation state.',
    inputSchema: {
      type: 'object',
      properties: { txid: { type: 'string' }, network: { type: 'string' } },
      required: ['txid'],
    },
  },
  {
    name: 'get_address',
    description: 'Address summary (UTXO + tx counts).',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        network: { type: 'string' },
      },
      required: ['address'],
    },
  },
  {
    name: 'get_address_transactions',
    description: 'Recent transactions for an address (~25 per call).',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        limit: { type: 'number', description: 'Default 25 (max ~50)' },
        network: { type: 'string' },
      },
      required: ['address'],
    },
  },
  {
    name: 'hashrate',
    description: 'Network hashrate + difficulty history.',
    inputSchema: {
      type: 'object',
      properties: {
        period: { type: 'string', description: '1d | 3d | 1w | 1m | 3m | 6m | 1y | 2y | 3y | all (default 3m)' },
        network: { type: 'string' },
      },
    },
  },
  {
    name: 'mining_pools',
    description: 'Block share by mining pool.',
    inputSchema: {
      type: 'object',
      properties: {
        period: { type: 'string', description: '24h | 3d | 1w | 1m | 3m | 6m | 1y | 2y | 3y | all (default 1w)' },
        network: { type: 'string' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const base = networkBase(args);
  switch (name) {
    case 'recommended_fees':
      return msGet(`${base}/v1/fees/recommended`);
    case 'mempool_stats':
      return msGet(`${base}/mempool`);
    case 'block_height': {
      const tipText = await msGetText(`${base}/blocks/tip/height`);
      return { network: (args.network as string) ?? 'mainnet', height: Number(tipText.trim()) };
    }
    case 'get_block':
      return msGet(`${base}/block/${encodeURIComponent(reqStr(args, 'hash_or_height', '"850000"'))}`);
    case 'get_transaction':
      return msGet(`${base}/tx/${encodeURIComponent(reqStr(args, 'txid', '"abc...txid"'))}`);
    case 'get_tx_status':
      return msGet(`${base}/tx/${encodeURIComponent(reqStr(args, 'txid', '"abc...txid"'))}/status`);
    case 'get_address':
      return msGet(`${base}/address/${encodeURIComponent(reqStr(args, 'address', '"bc1q..."'))}`);
    case 'get_address_transactions': {
      const data = (await msGet(
        `${base}/address/${encodeURIComponent(reqStr(args, 'address', '"bc1q..."'))}/txs`,
      )) as unknown[];
      const limit = Math.min(50, Math.max(1, (args.limit as number) ?? 25));
      return { count: Math.min(limit, data.length), transactions: data.slice(0, limit) };
    }
    case 'hashrate':
      return msGet(`${base}/v1/mining/hashrate/${encodeURIComponent(String(args.period ?? '3m'))}`);
    case 'mining_pools':
      return msGet(`${base}/v1/mining/pools/${encodeURIComponent(String(args.period ?? '1w'))}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function msGet(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-mempool-space/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('mempool.space: not found');
  if (res.status === 429) throw new Error('mempool.space: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`mempool.space error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

async function msGetText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'pipeworx-mcp-mempool-space/1.0 (+https://pipeworx.io)' },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`mempool.space error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.text();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
