# n8n-nodes-remove-special-chars

This package provides an n8n node for removing watermarks and special characters from text or JSON data. This is particularly useful when working with AI-generated content that may contain invisible watermarks (like those in OpenAI responses).

## Features

The Remove Special Characters node provides three cleaning strategies:

1. **Standard Clean**: Removes invisible/zero-width characters while preserving most text formatting
2. **Aggressive Clean**: Removes all non-alphanumeric characters (letters, numbers, spaces only)
3. **Smart Clean**: Targets common watermark patterns while preserving legitimate formatting

### Configuration Options

- **Mode**: Choose between Standard, Aggressive, or Smart cleaning
- **Input Field**: The field containing the text to clean
- **Output Field**: The field to store the cleaned text
- **Process JSON Objects**: Recursively process all string fields in JSON objects
- **Advanced Options** (Standard mode only):
  - Keep Punctuation
  - Keep Numbers
  - Keep Accented Characters
  - Custom Characters to Preserve

## Installation

Follow these steps to install this custom node:

```bash
# Install n8n if you haven't already
npm install n8n -g

# Install the custom node
npm install n8n-nodes-remove-special-chars

# Start n8n with the custom node
n8n start
```

## Usage

1. Add the "Remove Special Characters" node to your workflow
2. Configure the node:
   - Select the cleaning mode (Standard, Aggressive, or Smart)
   - Specify the input field containing text to clean
   - Specify the output field for the cleaned text
   - Adjust advanced options as needed
3. Connect the node to your workflow

## Character Types Removed

Depending on the cleaning mode, the node can remove:

- Zero-width characters (U+200B to U+200D, U+FEFF)
- Soft hyphens, combining marks (U+00AD, U+034F)
- Direction formatting characters (U+061C, U+2066-U+2069)
- Other invisible formatting characters
- Unusual Unicode character sequences often used in watermarks

## Development

If you want to contribute or modify this node:

1. Clone the repository
   ```
   git clone https://github.com/berrydev/n8n-nodes-remove-special-chars.git
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Build the code
   ```
   npm run build
   ```

4. Link to n8n
   ```
   npm link
   cd ~/.n8n
   npm link n8n-nodes-remove-special-chars
   ```

## License

[MIT](LICENSE.md)