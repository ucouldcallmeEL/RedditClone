# Reddit Clone API Documentation

Welcome to the Reddit Clone API documentation. This document provides comprehensive information about all available endpoints, request/response formats, authentication requirements, and data models to help you integrate your frontend application with our backend.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
   - [User Authentication](#user-authentication)
   - [Users](#users)
   - [Communities](#communities)
   - [Posts](#posts)
   - [Comments](#comments)
   - [Topics](#topics)
   - [Notifications](#notifications)
   - [File Uploads](#file-uploads)
   - [AI Features](#ai-features)
   - [Modmail](#modmail)
   - [Queue](#queue)
   - [Home Feed](#home-feed)

---

## Base URL

**Development:** `http://localhost:4000`  
**Production:** Set via environment variables when deploying

The API base URL is configurable via environment variables:
- **Backend:** Uses `PORT` environment variable (defaults to 4000)
- **Frontend:** Uses `REACT_APP_API_URL` environment variable for build-time configuration, or `window._env_.API_BASE_URL` for runtime configuration

All API endpoints are prefixed with `/api` except for:
- Community routes which use `/r` prefix (also available at `/api/r`)
- Topic routes which use `/topics` prefix
- Home feed routes which use root `/` prefix

**CORS Configuration:** The backend accepts requests from origins specified in the `FRONTEND_URL` environment variable (comma-separated for multiple origins). Defaults to `http://localhost:3000` in development.

---

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). To authenticate a request, include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

Tokens are returned when users successfully:
- Log in via email/username and password
- Sign up with email and password
- Sign in or sign up via phone number

Store the token securely (e.g., in localStorage or sessionStorage) and include it in subsequent authenticated requests.

---

## Error Handling

The API uses standard HTTP status codes:

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required or invalid token
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists (e.g., duplicate email/username)
- **500 Internal Server Error** - Server error

Error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Data Models

### User

```typescript
{
  _id: string;              // MongoDB ObjectId
  username: string;         // Required, unique
  email?: string;           // Optional, unique (sparse index)
  phone?: string;           // Optional, unique (sparse index)
  password: string;         // Hashed, never returned in responses
  profilePicture?: string;  // URL to profile image
  coverPicture?: string;    // URL to cover image
  bio?: string;            // User biography
  followers: ObjectId[];    // Array of User IDs
  following: ObjectId[];    // Array of User IDs
  karma: number;           // Default: 0
  posts: ObjectId[];       // Array of Post IDs
  comments: ObjectId[];     // Array of Comment IDs
}
```

### Post

```typescript
{
  _id: string;              // MongoDB ObjectId
  title: string;            // Required
  content?: string;         // Optional text content
  link?: string;            // Optional external link
  author: ObjectId;         // Reference to User
  community?: ObjectId;     // Reference to Community (optional)
  comments: ObjectId[];     // Array of Comment IDs
  mediaUrls: [              // Array of media objects
    {
      url: string;
      mediaId: string;
      mediaType: "image" | "video";
    }
  ];
  tags: {
    nsfw: boolean;          // Default: false
    spoiler: boolean;       // Default: false
    brand: boolean;         // Default: false
  };
  upvotes: number;          // Default: 0
  downvotes: number;        // Default: 0
  createdAt: Date;          // Auto-generated
  updatedAt: Date;          // Auto-generated
}
```

### Community

```typescript
{
  _id: string;              // MongoDB ObjectId
  name: string;             // Required, unique (e.g., "programming")
  description: string;      // Required
  profilePicture: string;   // Required, URL to profile image
  coverPicture: string;      // Required, URL to cover image
  topics: string[];         // Array of topic names
  type: "public" | "restricted" | "private";  // Default: "public"
  isNSFW: boolean;          // Default: false
  owner: ObjectId;          // Reference to User (creator)
  members: ObjectId[];      // Array of User IDs
  moderators: ObjectId[];    // Array of User IDs
  createdAt: Date;          // Auto-generated
}
```

### Comment

```typescript
{
  _id: string;              // MongoDB ObjectId
  content: string;          // Required
  author: ObjectId;         // Reference to User
  post: ObjectId;           // Reference to Post
  parentComment?: ObjectId; // Optional: Reference to parent comment for replies
  replies: ObjectId[];      // Array of Comment IDs (nested replies)
  upvotes: number;          // Default: 0
  downvotes: number;        // Default: 0
  createdAt: Date;          // Auto-generated
  updatedAt: Date;          // Auto-generated
}
```

---

## API Endpoints

## User Authentication

### Login

Authenticate a user with email/username and password.

**Endpoint:** `POST /api/users/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "identifier": "user@example.com",  // or "username"
  "password": "yourpassword"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com",
    "profilePicture": "https://...",
    "karma": 150,
    // ... other user fields (password excluded)
  }
}
```

**Error Responses:**
- `400` - Missing identifier or password
- `401` - Invalid credentials

---

### Sign Up - Check Email

Check if an email is already registered before proceeding with signup.

**Endpoint:** `POST /api/users/signup/check-email`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Email is available",
  "exists": false
}
```

**Error Responses:**
- `400` - Email is required
- `409` - Email already exists
  ```json
  {
    "error": "Email already exists",
    "exists": true
  }
  ```

---

### Sign Up

Create a new user account with email, username, and password.

**Endpoint:** `POST /api/users/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"  // Minimum 6 characters
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com",
    // ... other user fields (password excluded)
  }
}
```

**Error Responses:**
- `400` - Missing required fields or password too short
- `409` - Email or username already exists

---

### Reset Password - Check User

Check if a user exists before sending password reset instructions.

**Endpoint:** `POST /api/users/reset-password/check`

**Authentication:** Not required

**Request Body:**
```json
{
  "identifier": "user@example.com"  // or "username"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset link would be sent to your email",
  "exists": true
}
```

**Error Responses:**
- `400` - Identifier is required
- `404` - User not found

---

### Reset Password

Reset a user's password.

**Endpoint:** `POST /api/users/reset-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "identifier": "user@example.com",  // or "username"
  "newPassword": "newsecurepassword123",
  "resetToken": "optional-token"  // In production, this would be required
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - User not found

---

### Phone Sign In

Check if a phone number is registered. Returns user data if exists, or indicates new user.

**Endpoint:** `POST /api/users/phone/signin`

**Authentication:** Not required

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "Swift_Lion1234",
    "phone": "+1234567890",
    // ... other user fields
  },
  "isNewUser": false
}
```

**Or for new users:**
```json
{
  "message": "Phone number not registered",
  "isNewUser": true,
  "phone": "+1234567890"
}
```

**Error Responses:**
- `400` - Phone number is required

---

### Phone Sign Up

Create a new user account using only a phone number. A unique username is automatically generated.

**Endpoint:** `POST /api/users/phone/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "Swift_Lion1234",  // Auto-generated
    "phone": "+1234567890",
    // ... other user fields
  }
}
```

**Error Responses:**
- `400` - Phone number is required
- `409` - Phone number already registered

---

### Generate Username

Generate a unique username in the format `Adjective_Noun1234` (e.g., "Swift_Lion1234").

**Endpoint:** `GET /api/users/generate-username`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "username": "Brave_Falcon5678"
}
```

---

## Users

### Get Current User

Retrieve information about the currently authenticated user.

**Endpoint:** `GET /api/users/me`

**Authentication:** Required

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "user@example.com",
  "profilePicture": "https://...",
  "karma": 150,
  "followers": [],
  "following": [],
  // ... other user fields (password excluded)
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### Get User by Username

Retrieve user information by their username.

**Endpoint:** `GET /api/users/username/:username`

**Authentication:** Not required

**URL Parameters:**
- `username` (string, required) - The username of the user

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "user@example.com",
  "profilePicture": "https://...",
  "karma": 150,
  "followers": [],
  "following": [],
  // ... other user fields (password excluded)
}
```

**Error Responses:**
- `404` - User not found
- `500` - Server error

---

### Get User by ID

Retrieve user information by their user ID.

**Endpoint:** `GET /api/users/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "user@example.com",
  "profilePicture": "https://...",
  "karma": 150,
  "followers": [],
  "following": [],
  // ... other user fields (password excluded)
}
```

**Error Responses:**
- `404` - User not found
- `500` - Server error

---

### Update User Settings

Update settings for the authenticated user.

**Endpoint:** `PUT /api/users/update-settings`

**Authentication:** Required

**Request Body:**
```json
{
  "profilePicture": "https://...",
  "coverPicture": "https://...",
  "bio": "Updated bio text",
  // ... other updatable user fields
}
```

**Success Response (200):**
```json
{
  "message": "Settings updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    // ... updated user fields
  }
}
```

**Error Responses:**
- `400` - Invalid data
- `401` - Authentication required
- `500` - Server error

---

## Communities

### Get Community Details

Retrieve detailed information about a community by its name.

**Endpoint:** `GET /r/:communityName`

**Authentication:** Not required

**URL Parameters:**
- `communityName` (string, required) - The name of the community (case-insensitive)

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "programming",
  "description": "A community for programmers",
  "profilePicture": "https://...",
  "coverPicture": "https://...",
  "topics": ["Technology", "Programming"],
  "type": "public",
  "isNSFW": false,
  "owner": {
    "_id": "...",
    "name": "John Doe"
  },
  "members": [
    {
      "_id": "...",
      "name": "Jane Doe"
    }
  ],
  "moderators": [
    {
      "_id": "...",
      "name": "John Doe"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404` - Community not found
- `500` - Server error

---

### Check Community Name Availability

Check if a community name is already taken.

**Endpoint:** `GET /r/check/:communityName`

**Authentication:** Not required

**URL Parameters:**
- `communityName` (string, required) - The name to check

**Success Response (200):**
```json
{
  "exists": false,
  "isNameTaken": false
}
```

**If name exists:**
```json
{
  "exists": true,
  "isNameTaken": true
}
```

---

### Create Community

Create a new community. The authenticated user automatically becomes the owner, first member, and moderator.

**Endpoint:** `POST /r/create`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "programming",
  "description": "A community for programmers to share knowledge",
  "profilePicture": "https://...",  // Required
  "coverPicture": "https://...",    // Required
  "topics": ["Technology", "Programming", "Web Development"],
  "type": "public",  // "public" | "restricted" | "private"
  "isNSFW": false
}
```

**Note:** The `owner`, `members`, and `moderators` fields are automatically set from the authenticated user and should not be included in the request.

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "programming",
  "description": "A community for programmers to share knowledge",
  "owner": "507f1f77bcf86cd799439012",  // Your user ID
  "members": ["507f1f77bcf86cd799439012"],
  "moderators": ["507f1f77bcf86cd799439012"],
  // ... other community fields
}
```

**Error Responses:**
- `400` - Invalid data or missing required fields
- `401` - Authentication required
- `409` - Community name already exists

---

### Search Communities

Search for communities by substring matching (matches anywhere in the name, case-insensitive).

**Endpoint:** `GET /r/search/:substring`

**Authentication:** Not required

**URL Parameters:**
- `substring` (string, required) - The search term (e.g., "prog" will match "programming", "webprogramming", etc.)

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "programming",
    "description": "...",
    "profilePicture": "https://...",
    // ... other community fields
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "webprogramming",
    // ...
  }
]
```

**Note:** Returns up to 10 matching communities.

---

### Get User's Communities

Get all communities that a user is a member of.

**Endpoint:** `GET /r/user/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "programming",
    "description": "...",
    // ... other community fields
  }
]
```

**Note:** Returns an empty array if user has no communities.

---

### Get Current User's Communities

Get all communities for the authenticated user.

**Endpoint:** `GET /r/user/me`

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "programming",
    // ... other community fields
  }
]
```

---

## Posts

### Get All Posts

Retrieve all posts in the system.

**Endpoint:** `GET /api/posts`

**Authentication:** Not required

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Post",
    "content": "This is the post content...",
    "author": {
      "_id": "...",
      "username": "johndoe"
    },
    "community": {
      "_id": "...",
      "name": "programming"
    },
    "upvotes": 42,
    "downvotes": 3,
    "tags": {
      "nsfw": false,
      "spoiler": false,
      "brand": false
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Get Post Details

Retrieve detailed information about a specific post, including nested comments.

**Endpoint:** `GET /api/posts/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the post

**Success Response (200):**
```json
{
  "post": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Post",
    "content": "...",
    "author": {
      "_id": "...",
      "username": "johndoe"
    },
    // ... other post fields
  },
  "comments": [
    {
      "_id": "...",
      "content": "Great post!",
      "author": {
        "_id": "...",
        "username": "janedoe"
      },
      "replies": [
        {
          "_id": "...",
          "content": "Thanks!",
          "author": {
            "_id": "...",
            "username": "johndoe"
          },
          "replies": []
        }
      ]
    }
  ],
  "commentCount": 5
}
```

**Error Responses:**
- `404` - Post not found
- `500` - Server error

---

### Create Post

Create a new post. The authenticated user is automatically set as the author.

**Endpoint:** `POST /api/posts/create`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "My First Post",
  "content": "This is the post content...",  // Optional for link posts
  "link": "https://example.com",            // Optional for link posts
  "community": "507f1f77bcf86cd799439011",  // Optional, community ObjectId
  "tags": {
    "nsfw": false,
    "spoiler": false,
    "brand": false
  }
}
```

**Note:** The `author` field is automatically set from the authenticated user and should not be included in the request. For media posts, upload media separately using the upload endpoint after creating the post.

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My First Post",
  "content": "This is the post content...",
  "author": "507f1f77bcf86cd799439012",  // Your user ID
  "upvotes": 0,
  "downvotes": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  // ... other post fields
}
```

**Error Responses:**
- `400` - Invalid data or missing required fields
- `401` - Authentication required

---

### Get Posts by User

Retrieve all posts created by a specific user.

**Endpoint:** `GET /api/posts/user/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Post",
    // ... other post fields
  }
]
```

---

### Get Popular Posts

Retrieve popular posts filtered by time period.

**Endpoint:** `GET /api/posts/popular`

**Authentication:** Not required

**Query Parameters:**
- `filter` (string, optional) - Time filter: `"today"`, `"week"`, `"month"`, or `"all"` (default: `"all"`)

**Example:** `GET /api/posts/popular?filter=week`

**Success Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Popular Post",
      "upvotes": 1000,
      // ... other post fields
    }
  ],
  "timeFilter": "week",
  "count": 25
}
```

**Error Responses:**
- `400` - Invalid time filter

---

### Get Home Feed

Retrieve personalized home feed posts for a user (based on their subscribed communities).

**Endpoint:** `GET /api/posts/home/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Post from subscribed community",
      // ... other post fields
    }
  ],
  "isPersonalized": true
}
```

**Note:** If no userId is provided, returns all posts with `isPersonalized: false`.

---

### Get Upvoted Posts

Retrieve all posts that a user has upvoted.

**Endpoint:** `GET /api/posts/upvoted/:userId`

**Authentication:** Required (user can only view their own upvoted posts)

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Upvoted Post",
    "upvotes": 100,
    // ... other post fields
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `403` - Forbidden (can only view your own upvoted posts)
- `500` - Server error

---

### Get Downvoted Posts

Retrieve all posts that a user has downvoted.

**Endpoint:** `GET /api/posts/downvoted/:userId`

**Authentication:** Required (user can only view their own downvoted posts)

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Downvoted Post",
    "downvotes": 10,
    // ... other post fields
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `403` - Forbidden (can only view your own downvoted posts)
- `500` - Server error

---

### Vote on Post

Upvote, downvote, or remove vote from a post.

**Endpoint:** `POST /api/posts/vote/:id` or `POST /api/posts/:id/vote`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the post

**Request Body:**
```json
{
  "vote": 1    // 1 for upvote, -1 for downvote, 0 to remove vote
}
```

**Success Response (200):**
```json
{
  "success": true,
  "post": {
    "_id": "507f1f77bcf86cd799439011",
    "upvotes": 101,
    "downvotes": 5,
    "userVote": 1  // Current user's vote
  }
}
```

**Error Responses:**
- `400` - Invalid vote value
- `401` - Authentication required
- `404` - Post not found
- `500` - Server error

---

### Create Comment on Post

Create a new comment on a post. Can be a top-level comment or a reply to another comment.

**Endpoint:** `POST /api/posts/:id/comments`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the post

**Request Body:**
```json
{
  "content": "This is a great post!",
  "parentComment": "507f1f77bcf86cd799439012"  // Optional: ID of parent comment for replies
}
```

**Success Response (201):**
```json
{
  "comment": {
    "_id": "507f1f77bcf86cd799439013",
    "content": "This is a great post!",
    "author": {
      "_id": "...",
      "username": "johndoe",
      "profilePicture": "https://..."
    },
    "post": "507f1f77bcf86cd799439011",
    "parentComment": null,  // or parent comment ID if it's a reply
    "upvotes": 0,
    "downvotes": 0,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Content is required
- `401` - Authentication required
- `404` - Post not found
- `500` - Server error

---

## Comments

### Get Comments by User

Retrieve all comments made by a specific user.

**Endpoint:** `GET /api/comments/user/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "content": "Great post!",
    "author": {
      "_id": "...",
      "username": "johndoe"
    },
    "post": {
      "_id": "...",
      "title": "My Post"
    },
    "upvotes": 5,
    "downvotes": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `500` - Server error

---

### Vote on Comment

Upvote, downvote, or remove vote from a comment.

**Endpoint:** `POST /api/comments/vote/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the comment

**Request Body:**
```json
{
  "vote": 1    // 1 for upvote, -1 for downvote, 0 to remove vote
}
```

**Success Response (200):**
```json
{
  "success": true,
  "comment": {
    "_id": "507f1f77bcf86cd799439011",
    "upvotes": 6,
    "downvotes": 1,
    "userVote": 1  // Current user's vote
  }
}
```

**Error Responses:**
- `400` - Invalid vote value
- `401` - Authentication required
- `404` - Comment not found
- `500` - Server error

---

## Topics

### Get All Topics (Grouped by Category)

Retrieve all topics organized by their categories. Useful for displaying topics in a categorized format.

**Endpoint:** `GET /topics`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "Technology": [
    "Programming",
    "Web Development",
    "Mobile Development"
  ],
  "Gaming": [
    "PC Gaming",
    "Console Gaming",
    "Mobile Gaming"
  ],
  "Other": [
    "General Discussion"
  ]
}
```

---

### Get All Topics (Flat List)

Retrieve all topics as a flat list with their IDs and categories.

**Endpoint:** `GET /topics/list`

**Authentication:** Not required

**Success Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Programming",
    "category": "Technology"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Web Development",
    "category": "Technology"
  }
]
```

---

### Get Topics by Category

Retrieve all topics belonging to a specific category.

**Endpoint:** `GET /topics/category/:category`

**Authentication:** Not required

**URL Parameters:**
- `category` (string, required) - The category name (e.g., "Technology", "Gaming")

**Success Response (200):**
```json
[
  "Programming",
  "Web Development",
  "Mobile Development"
]
```

---

### Create Topic

Create a new topic (typically admin-only).

**Endpoint:** `POST /topics`

**Authentication:** Not required (consider adding authentication in production)

**Request Body:**
```json
{
  "name": "New Topic",
  "category": "Technology"  // Optional, defaults to "Other"
}
```

**Success Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "New Topic",
  "category": "Technology"
}
```

**Error Responses:**
- `400` - Topic name is required
- `409` - Topic already exists

---

## Notifications

### Get All Notifications

Retrieve all notifications for a user, sorted by most recent first.

**Endpoint:** `GET /api/notifications/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439012",
    "sender": {
      "_id": "...",
      "username": "johndoe"
    },
    "type": "comment",
    "message": "John Doe commented on your post",
    "post": {
      "_id": "...",
      "title": "My Post"
    },
    "isRead": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Get Unread Notifications

Retrieve only unread notifications for a user.

**Endpoint:** `GET /api/notifications/unread/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "isRead": false,
    // ... other notification fields
  }
]
```

---

### Mark All Notifications as Read

Mark all unread notifications as read for a user.

**Endpoint:** `PUT /api/notifications/mark-read/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

---

### Mark Single Notification as Read

Mark a specific notification as read.

**Endpoint:** `PUT /api/notifications/mark-one/:notifId`

**Authentication:** Not required

**URL Parameters:**
- `notifId` (string, required) - The MongoDB ObjectId of the notification

**Success Response (200):**
```json
{
  "success": true
}
```

---

### Delete Notification

Delete a specific notification.

**Endpoint:** `DELETE /api/notifications/:notifId`

**Authentication:** Not required

**URL Parameters:**
- `notifId` (string, required) - The MongoDB ObjectId of the notification

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

### Clear All Notifications

Delete all notifications for a user.

**Endpoint:** `DELETE /api/notifications/clear/:userId`

**Authentication:** Not required

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "success": true,
  "message": "All notifications cleared for this user"
}
```

---

## File Uploads

All upload endpoints accept `multipart/form-data` with a file field named `file`.

### Upload Post Media

Upload media (image or video) for a post. Call this after creating the post to attach media.

**Endpoint:** `POST /api/upload/post/:postId`

**Authentication:** Not required (consider adding authentication in production)

**URL Parameters:**
- `postId` (string, required) - The MongoDB ObjectId of the post

**Request:** `multipart/form-data`
- `file` (file, required) - The image or video file

**Success Response (200):**
```json
{
  "success": true
}
```

**Note:** The post's `mediaUrl`, `mediaId`, and `mediaType` fields are automatically updated.

---

### Upload Profile Picture

Upload or update a user's profile picture.

**Endpoint:** `POST /api/upload/profile/:userId`

**Authentication:** Not required (consider adding authentication in production)

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Request:** `multipart/form-data`
- `file` (file, required) - The image file

**Success Response (200):**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/..."
}
```

---

### Upload Cover Picture

Upload or update a user's cover picture.

**Endpoint:** `POST /api/upload/cover/:userId`

**Authentication:** Not required (consider adding authentication in production)

**URL Parameters:**
- `userId` (string, required) - The MongoDB ObjectId of the user

**Request:** `multipart/form-data`
- `file` (file, required) - The image file

**Success Response (200):**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/..."
}
```

---

## AI Features

### Summarize Post

Generate an AI-powered summary of a post using Google's Gemini AI.

**Endpoint:** `POST /api/ai/summarize/:postId`

**Authentication:** Not required

**URL Parameters:**
- `postId` (string, required) - The MongoDB ObjectId of the post

**Success Response (200):**
```json
{
  "postId": "507f1f77bcf86cd799439011",
  "summary": "This post discusses the latest trends in web development, focusing on React and modern JavaScript frameworks. The author shares insights about performance optimization and best practices."
}
```

**Error Responses:**
- `404` - Post not found
- `500` - AI service error

---

## Modmail

Modmail endpoints for managing conversations between users and moderators.

### Get Conversations

Retrieve all modmail conversations.

**Endpoint:** `GET /api/modmail/conversations`

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "subject": "Question about community rules",
    "participants": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "isArchived": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `500` - Server error

---

### Create Conversation

Create a new modmail conversation.

**Endpoint:** `POST /api/modmail/conversations`

**Authentication:** Required

**Request Body:**
```json
{
  "subject": "Question about community rules",
  "recipientId": "507f1f77bcf86cd799439012",
  "initialMessage": "I have a question about..."
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "subject": "Question about community rules",
  "participants": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid data
- `401` - Authentication required
- `500` - Server error

---

### Get Messages

Retrieve all messages in a conversation.

**Endpoint:** `GET /api/modmail/conversations/:id/messages`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the conversation

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "content": "I have a question about...",
    "sender": {
      "_id": "...",
      "username": "johndoe"
    },
    "conversation": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `404` - Conversation not found
- `500` - Server error

---

### Send Message

Send a message in a conversation.

**Endpoint:** `POST /api/modmail/conversations/:id/messages`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the conversation

**Request Body:**
```json
{
  "content": "This is my response..."
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "content": "This is my response...",
  "sender": {
    "_id": "...",
    "username": "johndoe"
  },
  "conversation": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Content is required
- `401` - Authentication required
- `404` - Conversation not found
- `500` - Server error

---

### Archive Conversation

Archive a modmail conversation.

**Endpoint:** `POST /api/modmail/conversations/:id/archive`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the conversation

**Success Response (200):**
```json
{
  "success": true,
  "message": "Conversation archived"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Conversation not found
- `500` - Server error

---

## Queue

Moderation queue endpoints for managing posts and comments pending approval.

### Get Queue Items

Retrieve all items in the moderation queue.

**Endpoint:** `GET /api/queue`

**Authentication:** Required (moderator/admin only)

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "type": "post",  // or "comment"
    "item": {
      "_id": "...",
      "title": "Post Title",
      "content": "..."
    },
    "submittedBy": {
      "_id": "...",
      "username": "johndoe"
    },
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `403` - Forbidden (moderator/admin only)
- `500` - Server error

---

### Approve Queue Item

Approve an item in the moderation queue.

**Endpoint:** `POST /api/queue/:id/approve`

**Authentication:** Required (moderator/admin only)

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the queue item

**Success Response (200):**
```json
{
  "success": true,
  "message": "Item approved"
}
```

**Error Responses:**
- `401` - Authentication required
- `403` - Forbidden (moderator/admin only)
- `404` - Queue item not found
- `500` - Server error

---

### Remove Queue Item

Remove/reject an item from the moderation queue.

**Endpoint:** `POST /api/queue/:id/remove`

**Authentication:** Required (moderator/admin only)

**URL Parameters:**
- `id` (string, required) - The MongoDB ObjectId of the queue item

**Success Response (200):**
```json
{
  "success": true,
  "message": "Item removed"
}
```

**Error Responses:**
- `401` - Authentication required
- `403` - Forbidden (moderator/admin only)
- `404` - Queue item not found
- `500` - Server error

---

## Home Feed

### Get Home Feed (Root Endpoint)

Retrieve personalized home feed posts. This endpoint attempts to get the userId from various sources (params, query, body, or authenticated user).

**Endpoint:** `GET /`

**Authentication:** Not required

**Query Parameters (optional):**
- `userId` (string) - The MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Post from subscribed community",
      // ... other post fields
    }
  ],
  "isPersonalized": true
}
```

**Note:** If no userId is found, returns all posts with `isPersonalized: false` and a warning message.

---

### Get Popular Posts (Root Endpoint)

Retrieve popular posts from the root endpoint.

**Endpoint:** `GET /popular`

**Authentication:** Not required

**Query Parameters:**
- `filter` (string, optional) - Time filter: `"today"`, `"week"`, `"month"`, or `"all"` (default: `"all"`)

**Success Response (200):**
```json
{
  "posts": [...],
  "timeFilter": "all",
  "count": 50
}
```

---

### Get All Posts (Root Endpoint)

Retrieve all posts from the root endpoint.

**Endpoint:** `GET /all`

**Authentication:** Not required

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Post",
    // ... other post fields
  }
]
```

---

## Health Check

### Server Health

Check if the server is running and healthy.

**Endpoint:** `GET /api/health`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Best Practices

### 1. Error Handling

Always check the HTTP status code and handle errors appropriately:

```javascript
try {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle error
}
```

### 2. Authentication

Store tokens securely and include them in authenticated requests:

```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/posts/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(postData)
});
```

### 3. File Uploads

Use `FormData` for file uploads:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch(`/api/upload/profile/${userId}`, {
  method: 'POST',
  body: formData
});
```

### 4. CORS

The API is configured to accept requests from the frontend URL specified in `FRONTEND_URL` environment variable (defaults to `http://localhost:3000`). Ensure your frontend origin matches this configuration.

---

## Support

For questions, issues, or contributions, please contact the development team or refer to the project repository.

---

**Last Updated:** January 2025  
**API Version:** 1.1

