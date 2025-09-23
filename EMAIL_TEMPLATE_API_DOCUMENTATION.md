# Email Template API Documentation

## Overview

The Email Template API provides endpoints for managing email templates stored in AWS S3. This service allows administrators to create, read, update, delete, and preview email templates for different applications (freezer, tennis, qaBot).

**Base URL:** `/api/email-templates`

**Authentication:** All endpoints require admin authentication via JWT token.

## Authentication

All routes require:
1. Valid JWT token in the Authorization header: `Bearer <token>`
2. Admin privileges (user role must be admin)

## Template Types

Valid template types:
- `VERIFICATION` - Email verification templates
- `WELCOME` - Welcome email templates
- `PASSWORD_RESET` - Password reset templates
- `NOTIFICATION` - General notification templates
- `NEWSLETTER` - Newsletter templates
- `INVOICE` - Invoice/billing templates
- `REMINDER` - Reminder templates

## App Entries

Valid app entries:
- `freezer` - Freezer application
- `tennis` - Tennis application
- `qaBot` - QA Bot application

---

## Endpoints

### 1. List All Templates

**GET** `/api/email-templates`

Retrieves a list of all email templates, optionally filtered by type.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter templates by type (see Template Types above) |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "template-id",
      "type": "VERIFICATION",
      "name": "Email Verification Template",
      "description": "Template for email verification",
      "version": "1.0.0",
      "tags": ["verification", "auth"],
      "author": "admin@example.com",
      "appEntry": "freezer",
      "createdAt": "2025-09-23T10:00:00Z",
      "updatedAt": "2025-09-23T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Error Responses

- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to list templates"
}
```

---

### 2. Get Specific Template

**GET** `/api/email-templates/:type/:id`

Retrieves a specific email template by type and ID.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Template type (see Template Types) |
| `id` | string | Yes | Template ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appEntry` | string | Yes | Application entry (freezer, tennis, qaBot) |

#### Response

```json
{
  "success": true,
  "data": {
    "metadata": {
      "id": "template-id",
      "name": "Email Verification Template",
      "description": "Template for email verification",
      "version": "1.0.0",
      "tags": ["verification", "auth"],
      "author": "admin@example.com"
    },
    "subject": "Please verify your email address",
    "htmlContent": "<html>...</html>",
    "textContent": "Please verify your email...",
    "variables": ["userName", "verificationLink"],
    "appEntry": "freezer",
    "from": "noreply@example.com",
    "type": "VERIFICATION"
  }
}
```

#### Error Responses

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid template type. Must be one of: VERIFICATION, WELCOME, PASSWORD_RESET, NOTIFICATION, NEWSLETTER, INVOICE, REMINDER"
}
```

- **400 Bad Request**
```json
{
  "success": false,
  "error": "appEntry query parameter is required and must be one of: freezer, tennis, qaBot"
}
```

- **404 Not Found**
```json
{
  "success": false,
  "error": "Template not found"
}
```

- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to fetch template"
}
```

---

### 3. Create New Template

**POST** `/api/email-templates`

Creates a new email template.

#### Request Body

```json
{
  "templateId": "verification-template-v1",
  "type": "VERIFICATION",
  "name": "Email Verification Template",
  "description": "Template for email verification",
  "version": "1.0.0",
  "tags": ["verification", "auth"],
  "author": "admin@example.com",
  "subject": "Please verify your email address",
  "htmlContent": "<html><body><h1>Welcome {{userName}}</h1><p>Click <a href='{{verificationLink}}'>here</a> to verify.</p></body></html>",
  "textContent": "Welcome {{userName}}. Please visit {{verificationLink}} to verify your email.",
  "variables": ["userName", "verificationLink"],
  "appEntry": "freezer",
  "from": "noreply@example.com",
  "userId": "user-id-optional"
}
```

#### Required Fields

- `templateId` (string): Unique identifier for the template
- `type` (string): Template type
- `name` (string): Display name for the template
- `subject` (string): Email subject line
- `htmlContent` (string): HTML version of the email
- `textContent` (string): Plain text version of the email
- `appEntry` (string): Application entry
- `from` (string): Sender email address

#### Optional Fields

- `description` (string): Template description
- `version` (string): Template version (defaults to "1.0.0")
- `tags` (array): Tags for categorization
- `author` (string): Template author (defaults to authenticated user's email)
- `variables` (array): Template variables for substitution
- `userId` (string): User ID (defaults to authenticated user's ID)

#### Response

```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "templateId": "verification-template-v1",
    "type": "VERIFICATION"
  }
}
```

#### Error Responses

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Missing required fields: templateId, type, name, subject, htmlContent, textContent, appEntry, from"
}
```

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid template type. Must be one of: VERIFICATION, WELCOME, PASSWORD_RESET, NOTIFICATION, NEWSLETTER, INVOICE, REMINDER"
}
```

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid appEntry. Must be one of: freezer, tennis, qaBot"
}
```

- **409 Conflict**
```json
{
  "success": false,
  "error": "Template with this ID and type already exists"
}
```

- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to create template"
}
```

---

### 4. Update Existing Template

**PUT** `/api/email-templates/:type/:id`

Updates an existing email template.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Template type |
| `id` | string | Yes | Template ID |

#### Request Body

```json
{
  "name": "Updated Email Verification Template",
  "description": "Updated template for email verification",
  "version": "1.1.0",
  "tags": ["verification", "auth", "updated"],
  "author": "admin@example.com",
  "subject": "Please verify your email address - Updated",
  "htmlContent": "<html><body><h1>Welcome {{userName}}</h1><p>Click <a href='{{verificationLink}}'>here</a> to verify.</p></body></html>",
  "textContent": "Welcome {{userName}}. Please visit {{verificationLink}} to verify your email.",
  "variables": ["userName", "verificationLink"],
  "appEntry": "freezer",
  "from": "noreply@example.com"
}
```

#### Required Fields

- `name` (string): Display name for the template
- `subject` (string): Email subject line
- `htmlContent` (string): HTML version of the email
- `textContent` (string): Plain text version of the email
- `appEntry` (string): Application entry
- `from` (string): Sender email address

#### Optional Fields

- `description` (string): Template description
- `version` (string): Template version
- `tags` (array): Tags for categorization
- `author` (string): Template author
- `variables` (array): Template variables for substitution

#### Response

```json
{
  "success": true,
  "message": "Template updated successfully",
  "data": {
    "templateId": "verification-template-v1",
    "type": "VERIFICATION"
  }
}
```

#### Error Responses

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid template type. Must be one of: VERIFICATION, WELCOME, PASSWORD_RESET, NOTIFICATION, NEWSLETTER, INVOICE, REMINDER"
}
```

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Missing required fields: name, subject, htmlContent, textContent, appEntry, from"
}
```

- **404 Not Found**
```json
{
  "success": false,
  "error": "Template not found"
}
```

- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to update template"
}
```

---

### 5. Preview Template

**POST** `/api/email-templates/:type/:id/preview`

Renders a template with test data for preview purposes.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Template type |
| `id` | string | Yes | Template ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appEntry` | string | Yes | Application entry (freezer, tennis, qaBot) |

#### Request Body

```json
{
  "data": {
    "userName": "John Doe",
    "verificationLink": "https://example.com/verify/abc123",
    "companyName": "Example Corp"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "subject": "Please verify your email address",
    "htmlContent": "<html><body><h1>Welcome John Doe</h1><p>Click <a href='https://example.com/verify/abc123'>here</a> to verify.</p></body></html>",
    "textContent": "Welcome John Doe. Please visit https://example.com/verify/abc123 to verify your email.",
    "from": "noreply@example.com"
  }
}
```

#### Error Responses

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid template type. Must be one of: VERIFICATION, WELCOME, PASSWORD_RESET, NOTIFICATION, NEWSLETTER, INVOICE, REMINDER"
}
```

- **400 Bad Request**
```json
{
  "success": false,
  "error": "appEntry query parameter is required and must be one of: freezer, tennis, qaBot"
}
```

- **404 Not Found**
```json
{
  "success": false,
  "error": "Template not found or failed to render"
}
```

- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to preview template"
}
```

---

### 6. Delete Template

**DELETE** `/api/email-templates/:type/:id`

Deletes an existing email template.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Template type |
| `id` | string | Yes | Template ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appEntry` | string | Yes | Application entry (freezer, tennis, qaBot) |

#### Response

```json
{
  "success": true,
  "message": "Template deleted successfully",
  "data": {
    "templateId": "verification-template-v1",
    "type": "VERIFICATION"
  }
}
```

#### Error Responses

- **400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid template type. Must be one of: VERIFICATION, WELCOME, PASSWORD_RESET, NOTIFICATION, NEWSLETTER, INVOICE, REMINDER"
}
```

- **400 Bad Request**
```json
{
  "success": false,
  "error": "appEntry query parameter is required and must be one of: freezer, tennis, qaBot"
}
```

- **404 Not Found**
```json
{
  "success": false,
  "error": "Template not found"
}
```

- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to delete template"
}
```

---

## Example Usage

### Create a verification email template

```bash
curl -X POST http://localhost:3000/api/email-templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "verification-v1",
    "type": "VERIFICATION",
    "name": "Email Verification",
    "subject": "Verify your email",
    "htmlContent": "<h1>Hello {{userName}}</h1><p>Click <a href=\"{{verificationLink}}\">here</a> to verify</p>",
    "textContent": "Hello {{userName}}. Visit {{verificationLink}} to verify your email.",
    "appEntry": "freezer",
    "from": "noreply@freezer.com",
    "variables": ["userName", "verificationLink"]
  }'
```

### Preview a template

```bash
curl -X POST "http://localhost:3000/api/email-templates/VERIFICATION/verification-v1/preview?appEntry=freezer" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "userName": "Alice Smith",
      "verificationLink": "https://freezer.com/verify/xyz789"
    }
  }'
```

### List all templates

```bash
curl -X GET http://localhost:3000/api/email-templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get a specific template

```bash
curl -X GET "http://localhost:3000/api/email-templates/VERIFICATION/verification-v1?appEntry=freezer" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- **200** - Success
- **201** - Created (for POST requests)
- **400** - Bad Request (invalid parameters)
- **401** - Unauthorized (missing or invalid authentication)
- **403** - Forbidden (not admin)
- **404** - Not Found (template doesn't exist)
- **409** - Conflict (template already exists)
- **500** - Internal Server Error

## Notes

1. All template content supports variable substitution using `{{variableName}}` syntax
2. Templates are stored in AWS S3 with organized folder structure
3. Admin authentication is required for all operations
4. Template IDs must be unique within the same type and app entry
5. Both HTML and text content are required for accessibility
6. Variable arrays help document what data the template expects
