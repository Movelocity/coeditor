# Docs API Documentation

## Overview
The Docs API provides endpoints for managing user documents, including reading, writing, and listing files.

## Authentication
All endpoints require user authentication via JWT token stored in `auth_token` cookie. Users can only access their own documents.

## Endpoints

### Get Document Content
```typescript
GET /api/docs/[userId]/[...path]
```
Retrieves the content of a specific document.

**Parameters:**
- `userId`: User ID
- `path`: Document path (array)

**Response:**
```json
{
  "content": "string"
}
```

**Error Responses:**
- 401: Unauthorized access
- 404: Document not found

Reference: 
```typescript:app/api/docs/[userId]/[...path]/route.ts
startLine: 5
endLine: 25
```

### Save Document Content
```typescript
POST /api/docs/[userId]/[...path]
```
Saves content to a specific document.

**Parameters:**
- `userId`: User ID
- `path`: Document path (array)

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Responses:**
- 401: Unauthorized access
- 500: Save failed

Reference:
```typescript:app/api/docs/[userId]/[...path]/route.ts
startLine: 27
endLine: 49
```

### List Documents
```typescript
GET /api/docs/[userId]/list
```
Lists all files and directories in a user's document space.

**Parameters:**
- `userId`: User ID
- `path` (query): Optional sub-path to list (defaults to root)

**Response:**
```json
{
  "files": [
    {
      "name": "string",
      "type": "file" | "directory",
      "path": "string"
    }
  ]
}
```

**Error Responses:**
- 401: Unauthorized access
- 500: Failed to retrieve file list

Reference:
```typescript:app/api/docs/[userId]/list/route.ts
startLine: 5
endLine: 26
```

## File Operations
The API uses the following utility functions for file operations:

### File System Functions
- `saveUserFile(userId, filePath, data)`: Saves file content
- `readUserFile(userId, filePath)`: Reads file content
- `listUserFiles(userId, subPath)`: Lists files and directories

Reference:
```typescript:app/lib/userFiles.ts
startLine: 5
endLine: 63
```

## Security Considerations
- All endpoints verify user authentication
- Users can only access their own documents
- File operations are restricted to user's designated directory
- Uses HTTP-only cookies for JWT token storage
