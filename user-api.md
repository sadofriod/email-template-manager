# User Service API Documentation

## Authentication System
- JWT token-based authentication (cookie-based)
- Role-based access control (USER, ADMIN)
- Password hashing with bcrypt
- Token expiration (24 hours)
- Email verification system with welcome emails
- Verification token management with rate limiting

## API Endpoints

### Base URL: 
- dev: http://localhost:3000/api/users
- prod: https://api.ashesborn.cloud/api/users

#### Public Routes (No Authentication Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/register` | Register a new user |
| POST   | `/login` | Login user |
| POST   | `/send-verification-email` | Send email verification |
| GET    | `/verify-email` | Verify email with token |
| GET    | `/email-verification-status/:email` | Check email verification status |

#### Protected Routes (Authentication Required)

##### Current User
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET    | `/me` | Get current user profile | Authenticated users |

##### Admin Only Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST   | `/` | Create a new user | Admin only |
| GET    | `/` | Get all users | Admin only |
| DELETE | `/:id` | Delete user | Admin only |

##### User Data Routes (Owner or Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET    | `/:id` | Get user by ID | Owner or Admin |
| GET    | `/email/:email` | Get user by email | Owner or Admin |
| PUT    | `/:id` | Update user | Owner or Admin |

## Request/Response Examples

### Register User
```json
POST /api/users/register
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123",
  "role": "USER"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-07-04T10:00:00Z",
    "updatedAt": "2025-07-04T10:00:00Z"
  },
  "notice": "A verification email has been sent to your email address. While verification is recommended, you can use your account immediately."
}
```

### Login User
```json
POST /api/users/login
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```
*Note: JWT token is set as an httpOnly cookie*

### Email Verification

#### Send Verification Email
```json
POST /api/users/send-verification-email
{
  "email": "user@example.com"
}

Response:
{
  "message": "Verification email sent successfully",
  "details": "Please check your email for verification instructions"
}
```

#### Verify Email
```json
GET /api/users/verify-email?token=verification_token_here

Response:
{
  "message": "Email verified successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true,
    "createdAt": "2025-07-04T10:00:00Z",
    "updatedAt": "2025-07-04T10:00:00Z"
  }
}
```

#### Check Verification Status
```json
GET /api/users/email-verification-status/user@example.com

Response:
{
  "exists": true,
  "emailVerified": false,
  "lastVerificationEmailSent": "2025-07-04T10:00:00Z",
  "canResendEmail": true
}
```

### Authentication
The API uses cookie-based JWT authentication. After successful login, the JWT token is automatically set as an httpOnly cookie and included in subsequent requests.

### Update User
```json
PUT /api/users/1
{
  "name": "Jane Doe",
  "password": "newpassword123"
}
```
*Note: Authentication is handled via cookies*

### Response Format
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2025-07-04T10:00:00Z",
  "updatedAt": "2025-07-04T10:00:00Z",
  "FreezerItems": [],
  "DocImages": []
}
```

## Error Handling
- 400: Bad Request (invalid input, verification email rate limit)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions, invalid token)
- 404: User not found
- 409: Conflict (email already exists, email already in use)
- 500: Internal server error

## Security Features
- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication with httpOnly cookies
- Role-based access control
- Owner-based data access
- Token expiration (24 hours)
- Input validation
- Email verification system
- Rate limiting for verification emails (5-minute cooldown)
- Secure token generation and validation

## Environment Variables
```
JWT_SECRET=your-secret-key-here
```

## Email Integration
The service integrates with an email service for:
- **Verification emails**: Sent automatically upon registration
- **Welcome emails**: Sent after successful email verification
- **Rate limiting**: Prevents spam by limiting verification emails to once per 5 minutes

## User Roles
- **USER**: Standard user with access to own data
- **ADMIN**: Administrative user with full access to all users and data

## Email Verification Workflow
1. User registers → Verification email sent automatically
2. User can log in immediately (verification not required for access)
3. User clicks verification link in email
4. Email is verified → Welcome email sent
5. User can check verification status anytime
