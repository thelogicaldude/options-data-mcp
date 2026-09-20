# Options Data MCP Server

MCP (Model Context Protocol) server that exposes Options Data API endpoints as native tools for AI agents.

## Install

```bash
npx -y options-data-mcp@latest
```

Or run from source:

```bash
git clone https://github.com/your-org/options-data-mcp
cd options-data-mcp
npm install && npm run build
npm run start
```

## Configure

Add to your agent's MCP config (e.g., Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "options-data": {
      "command": "npx",
      "args": ["-y", "options-data-mcp@latest"],
      "env": {
        "OPTIONS_DATA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `get_gamma` | Gamma exposure profile — dealer positioning, flip zone, pin strikes |
| `get_vrp` | Volatility richness — ATM IV vs HV30, premium read |
| `get_term_structure` | IV term structure and skew across DTE buckets |
| `get_structure` | Full bundle — gamma + VRP + term structure |
| `get_regime` | GEX regime — stabilizing vs destabilizing |
| `get_strikes` | Strike recommendations — wheel/CC picks or GEX support/resistance |
| `get_credit_spread` | Credit spread setup — GEX-regime-gated with sizing |
| `get_screener` | Universe screener — IV, fundamentals, earnings filter |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OPTIONS_DATA_API_KEY` | (empty) | API key for subscription access. Omit for x402 pay-per-call |
| `API_BASE` | `https://api.optionsdataapi.com` | API base URL |

## Pricing

See [api.optionsdataapi.com](https://api.optionsdataapi.com) for endpoint pricing and subscription tiers.
