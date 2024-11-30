# Authentication API Documentation

## Overview
The authentication system provides endpoints for user registration, login, logout, and session verification. All authentication is handled via JWT tokens stored in HTTP-only cookies.

## Endpoints

### Login
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Description**: Authenticates user and creates a session

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

**Reference Implementation:**
```typescript:app/api/auth/login/route.ts
startLine: 1
endLine: 47
```

### Register
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Description**: Creates a new user account

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

**Reference Implementation:**
```typescript:app/api/auth/register/route.ts
startLine: 1
endLine: 31
```

### Check Auth Status
- **Endpoint**: `/api/auth/check`
- **Method**: GET
- **Description**: Verifies current authentication status

**Success Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

**Reference Implementation:**
```typescript:app/api/auth/check/route.ts
startLine: 1
endLine: 36
```

### Logout
- **Endpoint**: `/api/auth/logout`
- **Method**: POST
- **Description**: Ends the current user session

**Success Response:**
```json
{
  "success": true
}
```

**Reference Implementation:**
```typescript:app/api/auth/logout/route.ts
startLine: 1
endLine: 9
```

## Authentication Flow
1. User registers or logs in
2. Server validates credentials
3. JWT token is generated and stored in HTTP-only cookie
4. Subsequent requests are authenticated via cookie
5. Token is verified on protected endpoints

## Security Features
- JWT tokens for stateless authentication
- HTTP-only cookies prevent XSS attacks
- Secure cookie settings in production
- Token expiration after 7 days

**Cookie Configuration:**
```typescript:app/lib/auth.ts
startLine: 74
endLine: 80
```

## Development Notes
- Super user authentication available in development environment
- JWT secret configurable via environment variables
- User data stored in local file system
```