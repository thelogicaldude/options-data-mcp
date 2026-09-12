#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.API_BASE || "https://api.optionsdataapi.com";
const API_KEY = process.env.OPTIONS_DATA_API_KEY || "";

async function fetchEndpoint(path: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}${path}${qs ? "?" + qs : ""}`;
  const headers: Record<string, string> = { "Accept": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`API error ${resp.status}: ${body}`);
  }
  return resp.json();
}

const server = new McpServer({
  name: "options-data",
  version: "0.1.0",
});

function registerTool(
  name: string,
  description: string,
  inputSchema: z.ZodObject<any>,
  handler: (args: any) => Promise<any>
) {
  server.tool(
    name,
    description,
    Object.fromEntries(
      Object.entries(inputSchema.shape).map(([key, schema]) => [
        key,
        { description: (schema as any).description || "", type: "string" },
      ])
    ),
    handler
  );
}

// Gamma exposure
registerTool(
  "get_gamma",
  "Get gamma exposure profile for a ticker — shows dealer positioning, flip zone, and pin strikes",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. AAPL, TSLA, SPY") }),
  async ({ ticker }) => fetchEndpoint("/gamma", { ticker })
);

// VRP
registerTool(
  "get_vrp",
  "Get volatility richness premium — compares ATM IV to 30-day realized volatility",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. AAPL, TSLA") }),
  async ({ ticker }) => fetchEndpoint("/vrp", { ticker })
);

// Term structure
registerTool(
  "get_term_structure",
  "Get IV term structure and skew across multiple DTE buckets",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. AAPL, SPY") }),
  async ({ ticker }) => fetchEndpoint("/term-structure", { ticker })
);

// Structure bundle
registerTool(
  "get_structure",
  "Full structure bundle — gamma, VRP, and term structure in one call",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. AAPL, TSLA, SPY") }),
  async ({ ticker }) => fetchEndpoint("/structure", { ticker })
);

// Regime
registerTool(
  "get_regime",
  "Get GEX regime — stabilizing vs destabilizing, flip zone status",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. AAPL, SPY") }),
  async ({ ticker }) => fetchEndpoint("/regime", { ticker })
);

// Strikes
registerTool(
  "get_strikes",
  "Get recommended strikes — wheel/covered-call picks or GEX-based support/resistance",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. AAPL, TSLA") }),
  async ({ ticker }) => fetchEndpoint("/strikes", { ticker })
);

// Credit spread
registerTool(
  "get_credit_spread",
  "Get credit spread setup — GEX-regime-gated put/call spreads with sizing",
  z.object({ ticker: z.string().describe("Ticker symbol, e.g. SPY, QQQ") }),
  async ({ ticker }) => fetchEndpoint("/credit-spread", { ticker })
);

// Screener
registerTool(
  "get_screener",
  "Screen a universe of stocks by IV, fundamentals, earnings filter — returns ranked results",
  z.object({
    ticker: z.string().optional().describe("Optional: filter to specific ticker. Omit for full universe scan"),
    min_iv: z.string().optional().describe("Minimum IV percentage (default 60)"),
    max_results: z.string().optional().describe("Max results to return (default 15)"),
  }),
  async ({ ticker, min_iv, max_results }) => {
    const params: Record<string, string> = {};
    if (ticker) params.ticker = ticker;
    if (min_iv) params.min_iv = min_iv;
    if (max_results) params.max_results = max_results;
    return fetchEndpoint("/screener", params);
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Options Data MCP server running on stdio");
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
