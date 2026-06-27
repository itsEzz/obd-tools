# OBD Tools

A lightweight collection of free, open-source online tools for working with OBD-II data — built specifically for the VAG community and OBDeleven users.

## Features

| Tool                 | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **SVM XOR**          | Resolve Software Version Management (1555 / B201A) fault codes by XORing the provided key. |
| **Coding Compare**   | Side-by-side hex comparison with bit-level highlighting to spot differences instantly.     |
| **Hex to Binary**    | Convert any hex string to its binary representation to analyze bit-level configurations.   |
| **PR Codes Lookup**  | Decode VAG PR codes to discover your vehicle's factory-installed features and equipment.   |
| **Backup Converter** | Convert OBDeleven backup files into compact, analysis-ready CSV format.                    |
| **API**              | Public REST API for all tools, documented via Scalar.                                      |

## Getting Started

**Prerequisites:** Node.js >= 20, pnpm >= 11

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server (http://localhost:5173)
pnpm build            # production build
pnpm preview          # preview production build
```

Copy `.env.example` to `.env` and adjust any values (optional — the app runs without it).

## Contributing

Contributions of all kinds are welcome — bug fixes, features, translations, documentation.  
See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.
