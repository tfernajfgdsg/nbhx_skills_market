# NBHX Skills Market - Project Summary

## Status

This repository is ready as a CodeBuddy-style skills marketplace with 4 plugins and their skill definitions.

## Current Structure

```text
nbhx_skills_market/
├── .codebuddy-plugin/
│   └── marketplace.json
├── PROJECT_SUMMARY.md
└── plugins/
    ├── content-generator/
    │   ├── .codebuddy-plugin/plugin.json
    │   └── skills/content-writer.SKILL.md
    ├── data-transform/
    │   ├── .codebuddy-plugin/plugin.json
    │   └── skills/data-transformer.SKILL.md
    ├── text-analysis/
    │   ├── .codebuddy-plugin/plugin.json
    │   └── skills/text-analyzer.SKILL.md
    └── voyah-order-export/
        ├── .codebuddy-plugin/plugin.json
        ├── SKILL.md
        └── scripts/
            ├── export_voyah_orders.js
            ├── package.json
            └── package-lock.json
```

## Marketplace Metadata

`/.codebuddy-plugin/marketplace.json` currently registers 4 plugins:

1. `text-analysis`
2. `content-generator`
3. `data-transform`
4. `voyah-order-export`

## Plugin Overview

### text-analysis
- Skill file: `plugins/text-analysis/skills/text-analyzer.SKILL.md`
- Focus: sentiment analysis, keyword extraction, readability, summarization.

### content-generator
- Skill file: `plugins/content-generator/skills/content-writer.SKILL.md`
- Focus: marketing copy, social posts, docs, creative writing.

### data-transform
- Skill file: `plugins/data-transform/skills/data-transformer.SKILL.md`
- Focus: format conversion, cleaning, validation, structural transformation.

### voyah-order-export
- Skill file: `plugins/voyah-order-export/SKILL.md`
- Script: `plugins/voyah-order-export/scripts/export_voyah_orders.js`
- Focus: automated export of Voyah weekly rolling forecast and daily consumption forecast reports.

## Quick Validation Checklist

- `marketplace.json` includes all plugin entries.
- Every plugin has a `plugin.json` file.
- Every plugin has at least one skill definition (`*.SKILL.md` or `SKILL.md`).
- `voyah-order-export/scripts/package.json` and lockfile are aligned (Playwright dependency present).

## Recommended Next Commands

```bash
# From repository root
codebuddy plugin validate .

# Optional: run Voyah export script
node plugins/voyah-order-export/scripts/export_voyah_orders.js --output-dir ./voyah_exports
```

## Version

- Marketplace version: `1.0.0`
- Last updated: `2026-04-09`
- Maintainer: `NBHX Team`
