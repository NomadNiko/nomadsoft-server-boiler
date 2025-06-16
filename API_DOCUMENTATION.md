# NomadSoft Server API Documentation

**Base URL**: `https://cdserver.nomadsoft.us/api/v1`  
**Version**: 1.0.0  
**Last Updated**: June 16, 2025

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Posts](#posts)
4. [Files](#files)
5. [Common Response Formats](#common-response-formats)
6. [Error Handling](#error-handling)

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Auth Endpoints

#### 1. Email Registration
**POST** `/auth/email/register`

Creates a new user account with email/password authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "status": 201
}
```

**Notes:**
- Password must be at least 6 characters
- Email must be unique
- Sends confirmation email (may fail silently)
- User status is set to "inactive" until email confirmed

---

#### 2. Email Login
**POST** `/auth/email/login`

Authenticates user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenExpires": 1750034677708,
  "user": {
    "id": "684f68f389c72641e77a560e",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "role": {
      "id": 2,
      "name": "User"
    },
    "status": {
      "id": 1,
      "name": "Active"
    },
    "photo": {
      "id": "file-id",
      "path": "https://s3-presigned-url..."
    },
    "provider": "email",
    "socialId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response:** `422 Unprocessable Entity`
```json
{
  "status": 422,
  "errors": {
    "email": "notFound"
  }
}
```

---

#### 3. Refresh Token
**POST** `/auth/refresh`

Refreshes JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenExpires": 1750034677708
}
```

---

#### 4. Logout
**POST** `/auth/logout` 🔐

Invalidates the current session.

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `204 No Content`

---

#### 5. Get Current User
**GET** `/auth/me` 🔐

Returns the authenticated user's information.

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "684f68f389c72641e77a560e",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "role": {
    "id": 2,
    "name": "User"
  },
  "status": {
    "id": 1,
    "name": "Active"
  },
  "photo": null,
  "provider": "email",
  "socialId": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### 6. Update Current User
**PATCH** `/auth/me` 🔐

Updates the authenticated user's information.

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "john_smith",
  "password": "NewPassword123!",
  "oldPassword": "OldPassword123!",
  "photo": {
    "id": "file-id"
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "684f68f389c72641e77a560e",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "username": "john_smith",
  "role": {
    "id": 2,
    "name": "User"
  },
  "status": {
    "id": 1,
    "name": "Active"
  },
  "photo": {
    "id": "file-id",
    "path": "https://s3-presigned-url..."
  },
  "provider": "email",
  "socialId": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Validation Rules:**
- Username: 3-20 characters, alphanumeric + underscore/hyphen
- Password change requires oldPassword
- Username must be unique

---

#### 7. Delete Current User
**DELETE** `/auth/me` 🔐

Soft deletes the authenticated user's account.

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

#### 8. Email Confirmation
**POST** `/auth/email/confirm`

Confirms user email address using hash from email.

**Request Body:**
```json
{
  "hash": "confirmation-hash-from-email"
}
```

**Response:** `204 No Content`

---

#### 9. Confirm New Email
**POST** `/auth/email/confirm/new`

Confirms email change using hash from email.

**Request Body:**
```json
{
  "hash": "confirmation-hash-from-email"
}
```

**Response:** `204 No Content`

---

#### 10. Forgot Password
**POST** `/auth/forgot/password`

Sends password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `204 No Content`

---

#### 11. Reset Password
**POST** `/auth/reset/password`

Resets password using token from email.

**Request Body:**
```json
{
  "password": "NewPassword123!",
  "hash": "reset-hash-from-email"
}
```

**Response:** `204 No Content`

---

### Social Authentication

#### 12. Google Login
**POST** `/auth/google/login`

Authenticates or registers user via Google.

**Request Body:**
```json
{
  "idToken": "google-id-token",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** Same as email login

---

#### 13. Facebook Login
**POST** `/auth/facebook/login`

Authenticates or registers user via Facebook.

**Request Body:**
```json
{
  "accessToken": "facebook-access-token",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** Same as email login

---

#### 14. Apple Login
**POST** `/auth/apple/login`

Authenticates or registers user via Apple.

**Request Body:**
```json
{
  "idToken": "apple-id-token",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** Same as email login

---

## Users

User management endpoints (admin only).

### User Endpoints

#### 1. Create User
**POST** `/users` 🔐 (Admin only)

Creates a new user account.

**Headers Required:**
- `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "jane_doe",
  "role": {
    "id": 2
  },
  "status": {
    "id": 1
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "684f68f389c72641e77a560f",
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "jane_doe",
  "role": {
    "id": 2,
    "name": "User"
  },
  "status": {
    "id": 1,
    "name": "Active"
  },
  "provider": "email",
  "socialId": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### 2. Get All Users
**GET** `/users` 🔐 (Admin only)

Returns paginated list of users.

**Headers Required:**
- `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `filters[email]` (optional): Filter by email
- `filters[firstName]` (optional): Filter by first name
- `filters[lastName]` (optional): Filter by last name
- `filters[username]` (optional): Filter by username
- `filters[role]` (optional): Filter by role ID
- `filters[status]` (optional): Filter by status ID
- `sort` (optional): Sort field (email, firstName, lastName, createdAt)
- `order` (optional): Sort order (ASC, DESC)

**Example Request:**
```
GET /users?page=1&limit=20&filters[role]=2&sort=createdAt&order=DESC
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "684f68f389c72641e77a560e",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "john_doe",
      "role": {
        "id": 2,
        "name": "User"
      },
      "status": {
        "id": 1,
        "name": "Active"
      },
      "photo": null,
      "provider": "email",
      "socialId": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "hasNextPage": true
}
```

---

#### 3. Get User by ID
**GET** `/users/:id` 🔐 (Admin only)

Returns a specific user by ID.

**Headers Required:**
- `Authorization: Bearer <admin-token>`

**Response:** `200 OK`
```json
{
  "id": "684f68f389c72641e77a560e",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "role": {
    "id": 2,
    "name": "User"
  },
  "status": {
    "id": 1,
    "name": "Active"
  },
  "photo": null,
  "provider": "email",
  "socialId": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### 4. Update User
**PATCH** `/users/:id` 🔐 (Admin only)

Updates a user's information.

**Headers Required:**
- `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "john_smith",
  "password": "NewPassword123!",
  "role": {
    "id": 1
  },
  "status": {
    "id": 2
  },
  "photo": {
    "id": "file-id"
  }
}
```

**Response:** `200 OK` (Same as Get User by ID)

---

#### 5. Delete User
**DELETE** `/users/:id` 🔐 (Admin only)

Soft deletes a user account.

**Headers Required:**
- `Authorization: Bearer <admin-token>`

**Response:** `204 No Content`

---

## Posts

Social media style posts with comments and images.

### Post Endpoints

#### 1. Create Post
**POST** `/posts` 🔐

Creates a new post.

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My First Post",
  "content": "This is the content of my post",
  "imageUrl": "https://example.com/legacy-image.jpg",
  "images": [
    {
      "id": "file-id-1"
    },
    {
      "id": "file-id-2"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "684f692789c72641e77a5633",
  "name": "My First Post",
  "content": "This is the content of my post",
  "imageUrl": "https://example.com/legacy-image.jpg",
  "images": [
    {
      "id": "file-id-1",
      "path": "https://s3-presigned-url-1..."
    },
    {
      "id": "file-id-2",
      "path": "https://s3-presigned-url-2..."
    }
  ],
  "user": {
    "id": "684f68f389c72641e77a560e",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "role": {
      "id": 2,
      "name": "User"
    },
    "status": {
      "id": 1,
      "name": "Active"
    },
    "photo": null,
    "provider": "email",
    "socialId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "comments": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Notes:**
- `name` is required (max 255 characters)
- `content` is required
- `imageUrl` is optional (legacy field for backward compatibility)
- `images` is optional array of file references

---

#### 2. Get All Posts
**GET** `/posts` 🔐

Returns paginated list of all posts.

**Headers Required:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```
GET /posts?page=1&limit=20
```

**Response:** `200 OK`
```json
[
  {
    "id": "684f692789c72641e77a5633",
    "name": "My First Post",
    "content": "This is the content of my post",
    "imageUrl": null,
    "images": [],
    "user": {
      "id": "684f68f389c72641e77a560e",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "john_doe",
      "role": {
        "id": 2,
        "name": "User"
      },
      "status": {
        "id": 1,
        "name": "Active"
      },
      "photo": null,
      "provider": "email",
      "socialId": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    "comments": [
      {
        "id": "comment-id",
        "content": "Nice post!",
        "user": {
          "id": "user-id",
          "email": "commenter@example.com",
          "firstName": "Jane",
          "lastName": "Smith",
          "username": "jane_smith"
        },
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

#### 3. Get My Posts
**GET** `/posts/my-posts` 🔐

Returns all posts created by the authenticated user.

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** `200 OK` (Same format as Get All Posts)

---

#### 4. Get Posts by User IDs
**POST** `/posts/by-users` 🔐

Returns posts from specific users (for following/friends feeds).

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userIds": ["user-id-1", "user-id-2", "user-id-3"]
}
```

**Response:** `200 OK` (Same format as Get All Posts)

**Notes:**
- Returns posts sorted by creation date (newest first)
- Empty array returns no posts
- Invalid user IDs are ignored

---

#### 5. Get Post by ID
**GET** `/posts/:id` 🔐

Returns a specific post by ID.

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "684f692789c72641e77a5633",
  "name": "My First Post",
  "content": "This is the content of my post",
  "imageUrl": null,
  "images": [],
  "user": {
    "id": "684f68f389c72641e77a560e",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "role": {
      "id": 2,
      "name": "User"
    },
    "status": {
      "id": 1,
      "name": "Active"
    },
    "photo": null,
    "provider": "email",
    "socialId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "comments": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### 6. Update Post
**PATCH** `/posts/:id` 🔐

Updates a post (only post owner can update).

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Post Title",
  "content": "Updated content",
  "imageUrl": "https://example.com/new-image.jpg",
  "images": []
}
```

**Response:** `200 OK` (Same as Get Post by ID)

**Notes:**
- Only the post owner can update
- Setting `images` to empty array clears all images
- All fields are optional

---

#### 7. Delete Post
**DELETE** `/posts/:id` 🔐

Deletes a post (only post owner can delete).

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

#### 8. Add Comment to Post
**POST** `/posts/:id/comments` 🔐

Adds a comment to a post.

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "This is my comment on the post"
}
```

**Response:** `201 Created`
```json
{
  "id": "comment-id",
  "content": "This is my comment on the post",
  "user": {
    "id": "684f68f389c72641e77a560e",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "role": {
      "id": 2,
      "name": "User"
    },
    "status": {
      "id": 1,
      "name": "Active"
    },
    "photo": null,
    "provider": "email",
    "socialId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### 9. Delete Comment
**DELETE** `/posts/:postId/comments/:commentId` 🔐

Deletes a comment from a post.

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

**Notes:**
- Comment owner can delete their own comments
- Post owner can delete any comment on their post

---

## Files

File upload management with S3 presigned URLs.

### File Endpoints

#### 1. Upload File
**POST** `/files/upload` 🔐

Generates presigned URL for S3 upload.

**Headers Required:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fileName": "profile-photo.jpg",
  "fileSize": 102400
}
```

**Response:** `201 Created`
```json
{
  "file": {
    "id": "684f68f389c72641e77a5610",
    "path": "files/2025/01/random-string.jpg"
  },
  "uploadSignedUrl": "https://s3.amazonaws.com/bucket/files/2025/01/random-string.jpg?X-Amz-Algorithm=..."
}
```

**Upload Process:**
1. Call this endpoint to get file ID and presigned URL
2. Upload file directly to S3 using the presigned URL (PUT request)
3. Reference the file ID in other endpoints (user photo, post images)

**Validation:**
- Only image files allowed: jpg, jpeg, png, gif
- Max file size: 5MB (configurable)

**Example S3 Upload (after getting presigned URL):**
```javascript
const response = await fetch(uploadSignedUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});
```

---

## Common Response Formats

### User Object
```json
{
  "id": "684f68f389c72641e77a560e",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "role": {
    "id": 2,
    "name": "User"
  },
  "status": {
    "id": 1,
    "name": "Active"
  },
  "photo": {
    "id": "file-id",
    "path": "https://s3-presigned-url..."
  },
  "provider": "email",
  "socialId": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### File Object
```json
{
  "id": "file-id",
  "path": "https://s3-presigned-url-with-1h-expiration..."
}
```

### Role Object
```json
{
  "id": 1,
  "name": "Admin"
}
```

**Available Roles:**
- `1`: Admin
- `2`: User

### Status Object
```json
{
  "id": 1,
  "name": "Active"
}
```

**Available Statuses:**
- `1`: Active
- `2`: Inactive

---

## Error Handling

### Error Response Format
```json
{
  "status": 422,
  "errors": {
    "field1": "errorCode1",
    "field2": "errorCode2"
  }
}
```

### Common HTTP Status Codes
- `200 OK`: Success
- `201 Created`: Resource created
- `204 No Content`: Success with no response body
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### Common Error Codes
- `notFound`: Resource not found
- `emailAlreadyExists`: Email already registered
- `usernameAlreadyExists`: Username already taken
- `invalidCredentials`: Invalid login credentials
- `mustBeNotEmpty`: Required field is empty
- `invalidHash`: Invalid confirmation/reset hash
- `incorrectOldPassword`: Old password doesn't match

---

## Authentication Notes

### JWT Token Details
- **Access Token Expiry**: 15 minutes
- **Refresh Token Expiry**: 10 years (3650 days)
- **Token Type**: Bearer

### Protected Endpoints
- 🔐 indicates endpoint requires authentication
- (Admin only) indicates endpoint requires admin role

### Token Refresh Strategy
1. Use access token for API calls
2. When access token expires (401 response), use refresh token to get new tokens
3. Store new tokens and retry original request

---

## Rate Limiting

Currently no rate limiting is implemented.

---

## CORS Configuration

The API accepts requests from configured frontend domains. Contact admin for CORS configuration changes.

---

## Notes

1. **Email Service**: Registration emails may fail silently due to SMTP configuration. User accounts are still created successfully.

2. **File URLs**: All file paths are automatically converted to S3 presigned URLs with 1-hour expiration. Clients should handle URL refresh.

3. **Soft Deletes**: User and post deletions are soft deletes. Data is marked as deleted but not removed from database.

4. **Username Validation**: 
   - 3-20 characters
   - Only alphanumeric, underscore, and hyphen allowed
   - Must be unique across all users

5. **Image Handling**:
   - Posts support both legacy `imageUrl` string field and new `images` array
   - Always use file upload endpoint for new images
   - S3 presigned URLs expire after 1 hour

6. **Pagination**: 
   - Default page size: 10
   - Maximum page size: 100 (not enforced currently)
   - Pages are 1-indexed

---

## Changelog

### Version 1.0.0 (June 16, 2025)
- Initial API documentation
- Added username field to users
- Added multiple image support to posts
- Added findPostsByUserIds endpoint for social feeds
- Fixed email service error handling

---

## Contact

For API access or issues, contact the development team.