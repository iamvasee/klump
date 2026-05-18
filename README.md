# Klump

**Klump** is a premium statutory management and compliance platform designed for modern entities, companies, and portfolios.

## Key Features

- **Entity Management**: Track legal entities, LLPs, and portfolios with statutory detail monitoring.
- **Stakeholder Directory**: Manage directors, partners, and key management personnel.
- **Compliance Dashboard**: Monitor annual filings, resolutions, and regulatory health.
- **Entity Relationships**: Map complex relationships between people and legal structures.
- **Modern UI**: Built with a "billion-dollar SaaS" aesthetic using Next.js and Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: Custom premium UI library
- **Mock DB**: Centralized in-memory state in `src/lib/mockdb.ts`
- **Domain Focus**: Statutory compliance and entity management.
