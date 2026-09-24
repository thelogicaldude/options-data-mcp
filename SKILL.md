---
name: options-data
description: Options market structure analysis — gamma exposure, volatility richness, IV term structure, GEX regime classification, strike recommendations, and credit spread setups for options traders and AI agents.
category: Finance & Trading
tags:
  - options
  - gamma
  - volatility
  - trading
  - gex
  - market-structure
  - finance
  - ai-agent
authors:
  - thelogicaldude
github: https://github.com/thelogicaldude/options-data-mcp
---

# Options Data — Market Structure Intelligence for Options Traders

Analyze options market structure: gamma exposure, dealer positioning, volatility richness, IV term structure, and regime classification. Powered by live market data via the Options Data API.

## What You Get

| Outcome | Tool |
|---------|------|
| **Gamma exposure profile** — dealer positioning, flip zone, pin strikes | `get_gamma` |
| **Volatility richness** — ATM IV vs 30-day realized vol, premium gauge | `get_vrp` |
| **IV term structure** — skew across DTE buckets (weekly through LEAPS) | `get_term_structure` |
| **Full structure bundle** — gamma + VRP + term structure in one call | `get_structure` |
| **GEX regime** — stabilizing vs destabilizing, flip zone status | `get_regime` |
| **Strike recommendations** — wheel/covered-call picks or GEX S/R levels | `get_strikes` |
| **Credit spread setup** — direction, strike, sizing (GEX-regime gated) | `get_credit_spread` |
| **Universe screener** — high-IV stocks with clean fundamentals, ranked | `get_screener` |

## Example Prompts

> "What's the gamma exposure for TSLA this week? Are dealers long or short gamma?"
>
> "Run a screener for high-IV stocks with good fundamentals. Show me the top 5."
>
> "For AAPL, is the GEX regime stabilizing or destabilizing? What are the key pin strikes?"
>
> "Compare IV term structure across AAPL, TSLA, and NVDA. Which has the richest skew?"
>
> "What's the best wheel setup for a tickers with stabilizing regime and rich VRP?"

## Installation

### MCP Server (Recommended)

```bash
npx -y options-data-mcp@latest
```

Add to your agent config (Claude Desktop, Cursor, Windsurf, etc.):

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

**No API key?** Omit `OPTIONS_DATA_API_KEY` — the server falls back to x402 pay-per-call (autonomous USDC payment on Base).

### Direct HTTP API

```bash
# Subscription auth (bypasses payment)
curl "https://api.optionsdataapi.com/gamma?ticker=AAPL" \
  -H "X-API-Key: sk_your_key_here"

# x402 pay-per-call (no signup needed)
curl "https://api.optionsdataapi.com/gamma?ticker=AAPL"
# → 402 Payment Required → pay USDC → retry → 200 OK
```

See [api.optionsdataapi.com](https://api.optionsdataapi.com) for full pricing and subscription tiers.

## Use Cases

- **Weekly options scan** — Run `get_screener` → pick top tickers → deep dive with `get_structure` + `get_regime`
- **Wheel strategy** — Use `get_strikes` for covered-call picks, `get_credit_spread` for cash-secured put entries
- **Gamma squeeze detection** — Monitor flip zone breaches and pin strikes across your watchlist
- **Volatility trading** — Compare VRP and IV skew to identify rich/cheap IV opportunities
- **Risk management** — Track regime shifts from stabilizing → destabilizing as early warning signals

## Pricing

- **Subscription:** $49/mo (500 calls) or $129/mo (2,000 calls) — bypasses payment per call
- **Pay-per-call (x402):** $0.25–$2.00 per endpoint — no signup, autonomous USDC payment
- **MCP with API key:** One subscription = all 8 tools, no per-call friction

See [api.optionsdataapi.com](https://api.optionsdataapi.com) for details.

## Resources

- **GitHub:** https://github.com/thelogicaldude/options-data-mcp
- **API Docs:** https://api.optionsdataapi.com/agent-docs
- **Pricing:** https://api.optionsdataapi.com
- **npm:** https://www.npmjs.com/package/options-data-mcp