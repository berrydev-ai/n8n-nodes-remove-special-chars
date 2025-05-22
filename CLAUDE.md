# CLAUDE.md - n8n Remove Special Characters Node

## Project Goal

This project creates a custom n8n node that removes watermarks and special characters from text or JSON data. This is particularly useful when working with AI-generated content that may contain invisible watermarks (like those in OpenAI responses).

## Development Commands

- Setup: `npm i` (install dependencies)
- Build: `npm run build` (compiles TS + processes icons)
- Dev: `npm run dev` (TS watch mode)
- Format: `npm run format` (Prettier)
- Lint: `npm run lint` (ESLint)
- Lint & Fix: `npm run lintfix`
- Test locally: See [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/)

## Prerequisites

- Node.js (v20+) and npm
- n8n installed globally: `npm install n8n -g`
- Recommended: Set up [n8n development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/)

## Code Style

- TypeScript with strict typing (tsconfig.json)
- ES2019 target with CommonJS modules
- 2-space indentation with tabs
- Single quotes for strings
- 100 character line limit
- Semicolons required
- Trailing commas required

## Project Structure

- `/nodes/`: Node implementation files
  - Each node has its own directory
  - Node files: `[NodeName].node.ts`
- `/credentials/`: Credential files
  - Credential files: `[Name].credentials.ts`

## Naming Conventions

- Classes: PascalCase (RemoveSpecialCharsNode)
- Parameters/variables: camelCase
- Follow n8n node package naming standards

## Watermark Removal Implementation

The node will implement three cleaning strategies:

1. **Standard Clean**: Removes invisible/zero-width characters while preserving most text formatting
2. **Aggressive Clean**: Removes all non-alphanumeric characters (letters, numbers, spaces only)
3. **Smart Clean**: Targets common watermark patterns while preserving legitimate formatting

### Key Functions

```javascript
// Standard cleaner with options
function cleanSpecialCharacters(text, options = {})

// Aggressive cleaner (letters, numbers, spaces only)
function aggressiveClean(text)

// Smart cleaner (targets common watermark patterns)
function smartClean(text)
```

### Character Types Removed

- Zero-width characters (U+200B to U+200D, U+FEFF)
- Soft hyphens, combining marks (U+00AD, U+034F)
- Direction formatting characters (U+061C, U+2066-U+2069)
- Other invisible formatting characters
- Unusual Unicode character sequences

## Configuration Options

The node will support these options:

- Cleaning strategy (standard/aggressive/smart)
- Custom character preservation
- Keep/remove punctuation
- Keep/remove numbers
- Keep/remove accented characters

## Documentation

For detailed information on creating n8n nodes, refer to:

- [n8n Documentation](https://docs.n8n.io/integrations/creating-nodes/)
