# Koala Data Explorer Documentation

This repository contains the official documentation for Koala Data Explorer, a professional SQL tool for Oracle Fusion Cloud.

## About Koala Data Explorer

Koala Data Explorer is a VS Code extension that provides:

- Professional SQL editor with syntax highlighting
- Direct connection to Oracle Fusion Cloud
- Export capabilities (CSV, JSON, Excel)
- Query performance monitoring
- Multiple environment management

## Documentation Structure

- **Getting Started**: Installation and setup guides
- **Connections**: Authentication and connection management
- **Query Editor**: SQL editing and execution
- **Results**: Data viewing, filtering, and export
- **Advanced**: Performance monitoring and advanced features
- **Configuration**: Settings and customization
- **Licensing**: Free vs paid features
- **Troubleshooting**: Common issues and solutions
- **Support**: Getting help and reporting issues

## Development

This documentation is built with [Mintlify](https://mintlify.com). To preview changes locally:

### Install Mintlify CLI

```bash
npm i -g mint
```

### Run Local Development

```bash
mint dev
```

View your local preview at `http://localhost:3000`.

## Publishing Changes

Changes are automatically deployed to production when pushed to the main branch via GitHub integration.

## Contributing

When updating documentation:

1. Follow the existing style and format
2. Test all code examples
3. Include proper frontmatter (title, description)
4. Use relative links for internal references
5. Add appropriate icons for cards and sections

## Need Help?

### Documentation Issues
- Check existing documentation first
- Review troubleshooting sections
- Test with minimal examples

### Resources
- [Mintlify documentation](https://mintlify.com/docs)
- [Koala Data Explorer VS Code extension](https://marketplace.visualstudio.com/items?itemName=btss.koala-data-explorer)
- [BTSS Corporation](https://btsscorp.com)

## Project Structure

```
docs/
├── koala/                   # Main Koala documentation
│   ├── installation/       # Setup guides
│   ├── connections/         # Connection management
│   ├── editor/             # Query editor features
│   ├── results/            # Data viewing and export
│   ├── advanced/           # Advanced features
│   ├── config/             # Configuration
│   ├── licensing/          # License information
│   ├── troubleshooting/    # Common issues
│   └── support/            # Getting help
├── logo/                   # Koala logos (light/dark)
├── images/                 # Documentation images
└── docs.json              # Navigation configuration
```