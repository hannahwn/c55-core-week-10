# Post Central - Fetch & APIs Homework Assignment

A homework assignment for learning to use `fetch()` and work with REST APIs in Node.js.

## Learning Objectives

In this assignment you will practice the following:

- ✓ Make HTTP requests using the `fetch()` API
- ✓ Understand and use different HTTP methods (GET, POST, PUT, DELETE)
- ✓ Work with JSON request and response bodies
- ✓ Handle HTTP headers (especially `Content-Type` and `Authorization`)
- ✓ Implement proper error handling for API calls
- ✓ Use async/await with asynchronous operations
- ✓ Understand token-based authentication (JWT)

## Prerequisites

- Node.js installed (v18 or higher)
- Basic JavaScript knowledge (functions, promises)
- The [Learning Resources](https://github.com/HackYourFuture/Learning-Resources) repo cloned locally

## Setup

### 1. Start the API Server

The Post Central API server lives in your Learning Resources repo. Open a terminal and start it:

```bash
cd <path-to-learning-resources>/core-program/week-9/post-central
npm install
npm start
```

Keep this terminal open while you work on the assignment. The server runs on `http://localhost:3000`.

### 2. Install and Run the CLI

Open a **second terminal** for the CLI:

```bash
npm install
npm start     # Runs the application with your code
```

The CLI runs in **watch mode** — whenever you save your code, it restarts automatically. Your workflow will be: edit → save → the CLI restarts → log in → test your changes. Keep this terminal open while you work through the exercises.

The main application logic is provided ready-made so you can focus on implementing the API functions.

> [!TIP]
> Curious how the CLI, tests, and token management work under the hood? See [README_BACKGROUND.md](README_BACKGROUND.md) for an architecture overview of the parts you don't need to modify.

## API Documentation

### Base URL

The `BASE_URL` in your `services.js` file should point to your locally running Post Central API server:

```plaintext
http://localhost:3000
```

### Authentication

The API uses **JWT (JSON Web Token)** authentication:

1. **Register** or **Login** to receive a token.
2. Include the token in the `Authorization` header for all protected endpoints.
3. Header format: `Authorization: Bearer <your-token>`.

Build the correct headers inline for each request: `Authorization: Bearer <your-token>`.

### Endpoints

| Method | Endpoint          | Auth Required | Request Body                          | Response                                     |
| ------ | ----------------- | ------------- | ------------------------------------- | -------------------------------------------- |
| POST   | `/users/register` | No            | `{ name: string, password: string }`  | `{ user: string, token: string }`            |
| POST   | `/users/login`    | No            | `{ name: string, password: string }`  | `{ user: string, token: string }`            |
| GET    | `/posts/hello`    | No            | -                                     | `{ id: number, user: string, text: string, timestamp: string }` |
| GET    | `/users/me`       | Yes           | -                                     | `{ user: string, createdAt: string, lastLogin: string }` |
| DELETE | `/users/me`       | Yes           | -                                     | `{ user: string, message: string }`          |
| GET    | `/posts/me`       | Yes           | -                                     | `Array of posts`                             |
| POST   | `/posts`          | Yes           | `{ text: string }`                    | `{ id: number, text: string, user: string }` |
| PUT    | `/posts/:id`      | Yes           | `{ text: string }`                    | `{ id: number, text: string }`               |
| DELETE | `/posts/:id`      | Yes           | -                                     | `{ id: number, text: string, message: string }` |

### Common HTTP Status Codes

- **200 OK** - Request succeeded.
- **201 Created** - Resource created successfully.
- **400 Bad Request** - Invalid request data.
- **401 Unauthorized** - Missing or invalid token.
- **403 Forbidden** - You can only modify your own posts.
- **404 Not Found** - Resource not found.
- **409 Conflict** - Username already exists.
- **500 Internal Server Error** - Server error.

## Exercise Structure

### Verify Your Setup

If you followed the [Setup](#setup) steps above, running `npm start` should show a **"Welcome to Post Central!"** message. This confirms your CLI can reach the server. If you see a connection error instead, double-check that the server is running on `http://localhost:3000`.

Open `services.js` and read the `getHello()` function that makes this work — it's a simple `fetch()` call with no headers. You'll write similar code in the next exercises.

### Exercise 1: Simple GET Request

> **Before you start:** The `getMe()` endpoint requires authentication. The `createUser()` function is already implemented for you, so choose **Register** in the CLI to create an account. This gives you a token that the CLI stores automatically.

- Implement `getMe()` — use `fetch()` to call the endpoint, check `response.ok`, and parse the result with `response.json()`.
- Include the `Authorization` header with the token (see the API documentation above).
- Run `npm run test:me` to verify your implementation works.
- Try removing the `Authorization` header from your code and observe what error the server returns.

### Exercise 2: POST with Body

- Read the provided `createUser()` implementation in `services.js` — use it as a reference.
- Implement `loginUser()` following the same pattern: set the `method`, include `Content-Type: application/json` in the headers, and pass the body with `JSON.stringify()`.
- Note that `register` and `login` are public endpoints — they do not need an `Authorization` header.

### Exercise 3: Complete CRUD

- Implement `createPost()`, `updatePost()`, `getPosts()`, and `deletePost()`.
- Use the endpoint table above to determine the correct method, URL, headers, and body for each function.
- Test each function through the CLI as you go.

### Exercise 4: Error Handling

- Try different failure scenarios in the CLI (e.g. registering a username that already exists, editing someone else's post).
- Check that your functions throw clear error messages when the server returns an error response.
- Run `npm test` to verify your implementations pass all tests.

## Files in This Project

- **post-cli/src/services.js** - Your working file - implement the API functions here
- **post-cli/src/post-cli.js** - Application entry point (provided ready-made)
- **post-cli/tests/** - Vitest tests to verify your functions work correctly

## Testing Your Functions

We use **Vitest** for testing. The tests verify that **your functions** work correctly by:

- **Mocking fetch** to avoid needing a running API server.
- Verifying you call fetch with the correct URL, method, headers, and body.
- Checking you parse and return responses correctly.
- Testing error handling.

```bash
# Run all tests in watch mode (recommended)
npm test

# Run specific test suites
npm run test:me       # Test only getMe()
npm run test:get      # Test your GET functions (getMe, getPosts)
npm run test:post     # Test your POST functions (createUser, loginUser, createPost)
npm run test:crud     # Test complete workflow (all functions together)

# Run tests once (no watch mode)
npm run test:run
```

## Tips for Success

1. Implement one function at a time in `services.js`. When you save, the CLI restarts automatically — just log in and test.
2. Test each function before moving to the next.
3. Read error messages carefully - they tell you what's wrong.
4. Use `console.log()` to inspect responses during development.
5. Check the API documentation when unsure about request format.
6. Read the provided `getHello()` in `services.js` — it shows the simplest possible `fetch()` call.
7. Remember: `register` and `login` don't need an Authorization header, but everything else does.
8. Don't hesitate to ask your mentor for help.

Good luck!
