"# XML to JSON Backend

A Node.js Express backend service that converts XML files to JSON format using a custom-built XML parser.

## Features

- **Custom XML Parser**: No external XML parsing libraries used - built from scratch
- **File Upload Support**: Accepts XML file uploads via multipart/form-data
- **JSON Output**: Converts XML structure to JSON with proper attribute handling
- **CORS Enabled**: Configured for cross-origin requests from specified frontend applications
- **File Validation**: Validates file types and size limits
- **Entity Decoding**: Properly handles XML entities (&lt;, &gt;, &amp;, &quot;, &apos;)
- **Attribute Preservation**: XML attributes are preserved with underscore prefixes

## Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd xmlToJson-backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   ```

## Running the Application

### Development Mode
```bash
pnpm run dev
```

### Production Mode
```bash
pnpm run start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Documentation

### POST /api/xmlToJson

Converts an uploaded XML file to JSON format.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: XML file upload (field name: any, accepts multiple files but processes the first one)

**File Requirements:**
- File type: XML (.xml extension or text/xml, application/xml mimetype)
- Maximum size: 10MB
- Only one XML file is processed per request (even if multiple files are uploaded)

**Response:**

**Success (200):**
```json
{
  "message": "Conversion successful",
  "output": {
    // JSON representation of the XML
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "No XML file uploaded"
}
```
```json
{
  "error": "Only XML files are allowed"
}
```
```json
{
  "error": "File too large. Maximum size is 10MB."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to convert XML to JSON"
}
```

### Example Usage

Using curl:
```bash
curl -X POST \
  -F "xml=@public/test.xml" \
  http://localhost:3000/api/xmlToJson
```

### XML to JSON Conversion Rules

1. **XML Declaration and Comments**: Removed during preprocessing
2. **Attributes**: Converted to properties with underscore prefix (e.g., `id="123"` becomes `"_id": "123"`)
3. **Text Content**: Preserved as string values
4. **Nested Elements**: Converted to nested objects
5. **Multiple Elements**: Converted to arrays when multiple elements with the same name exist
6. **Self-Closing Tags**: Converted to objects with attributes only
7. **Entity Decoding**: XML entities are decoded to their character equivalents

### Sample Input/Output

**Input XML (public/test.xml):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<library name="Central Library" established="1892">
    <books>
        <book id="001" available="true">
            <title>The Great Adventure</title>
            <author>Jane Smith</author>
        </book>
    </books>
</library>
```

**Output JSON:**
```json
{
  "library": {
    "_name": "Central Library",
    "_established": "1892",
    "books": {
      "book": {
        "_id": "001",
        "_available": "true",
        "title": "The Great Adventure",
        "author": "Jane Smith"
      }
    }
  }
}
```

## Project Structure

```
xmlToJson-backend/
├── src/
│   ├── index.js      # Express server setup and configuration
│   ├── routes.js     # API route definitions
│   └── parser.js     # Custom XML to JSON parser implementation
├── public/
│   └── test.xml      # Sample XML file for testing
├── output.json       # Generated JSON output from last conversion
├── package.json      # Project dependencies and scripts
├── pnpm-lock.yaml    # Lockfile for pnpm
└── README.md         # This file
```

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:5173` (local development frontend)
- `https://accurate-energy-solutions.vercel.app` (deployed frontend)
- `https://xml-to-json-frontend.vercel.app/` (alternative deployed frontend)" 
