# How Post CLI Works

This document explains the parts of the application you **don't** modify — the CLI, the test system, and how everything connects. Understanding these pieces will help you see where your `services.js` code fits in.

## How the pieces fit together

Your `services.js` is the only file that talks to the server. It sits between two consumers:

- **The CLI** (`post-cli.js`) imports your functions and calls them in response to menu selections. It handles all user interaction — you handle all server communication.
- **The tests** (`tests/`) import the same functions but replace `fetch()` with a mock, so they can verify your code without a running server.

Both the CLI and the tests also use `setToken()` to store a JWT token before calling your functions, and your functions use `getToken()` to read it. This is why you can test your code without running the CLI, and why the CLI works once your functions are correct.

## The CLI (`post-cli.js`)

The CLI is the interactive terminal application you use to test your work. It is provided ready-made — you do not need to modify it.

### Two-phase flow

1. **Authentication phase** (`chooseAuthAction`) — The CLI connects to the server, shows a welcome message, and presents a menu to register or log in. On success, it calls `setToken()` to store the JWT token.
2. **Main loop** (`runMainLoop`) — After authentication, the CLI presents a menu of actions (create, view, update, delete posts, delete account, exit). Each action calls one of your service functions.

### How it uses your code

The CLI imports your functions and calls them directly, for example:

```
loginUser(name, password) → receives { user, token } → calls setToken(token)
getPosts()                → receives array of posts  → displays them
createPost(text)          → receives { id, text }    → confirms creation
```

The CLI handles all user interaction (prompts, menus, colored output). Your functions handle all server communication. This separation means you can focus entirely on `fetch()` without worrying about the terminal UI.

### Error handling

Every service call in the main loop is wrapped in a `try/catch`. If your function throws an error (e.g. when `response.ok` is `false`), the CLI catches it and displays the error message in red. You don't need to handle display logic — just throw meaningful errors.

## Token Management

The token system bridges authentication and API calls using two functions defined in `services.js`:

- **`setToken(token)`** — Saves the JWT token to a module-level variable. Called by the CLI after a successful login or registration.
- **`getToken()`** — Returns the stored token. Your service functions use this to build the `Authorization: Bearer <token>` header.

```
Register/Login → server returns token → CLI calls setToken(token)
                                                    ↓
Your functions → getToken() → adds to Authorization header → server validates
```

The token lives as a variable inside `services.js`. This means both the CLI and the tests can set it with `setToken()`, and your functions read it with `getToken()`. The tests use this to inject a mock token before calling your functions.

## The Test System

Tests verify that your functions make the correct `fetch()` calls **without needing a running server**.

### How mocking works

Before each test, Vitest replaces the global `fetch` function with a mock:

```js
fetchMock = vi.spyOn(global, 'fetch');
```

This mock intercepts every `fetch()` call your functions make. The test then provides a fake response:

```js
fetchMock.mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => ({ user: 'Alice' }),
});
```

Your function calls `fetch()` as normal, but instead of hitting a server, it receives this fake response. The test then checks what your function passed to `fetch()`.

### What tests verify

Each test checks four things about your `fetch()` call:

1. **URL** — Did you call the correct endpoint? (e.g. `/users/me`)
2. **Method** — Did you use the right HTTP method? (e.g. `GET`, `POST`, `DELETE`)
3. **Headers** — Did you include the required headers? (`Content-Type`, `Authorization`)
4. **Body** — Did you send the correct JSON body? (for POST/PUT requests)

Tests also verify that your function returns the parsed JSON response and throws errors when the server returns a non-ok status.

### Reading test output

When you run `npm test`, you'll see output like this:

```
 ✓ GET Functions > getMe() > should make GET request to /users/me with Authorization header
 ✗ GET Functions > getPosts() > should make GET request to /posts/me with Authorization header
```

A checkmark means your function works correctly. An `✗` with an error message tells you what went wrong — read the message carefully, it usually points directly to the issue (wrong URL, missing header, etc.).

### Test commands

| Command             | What it tests                              |
| ------------------- | ------------------------------------------ |
| `npm test`          | All tests in watch mode (re-runs on save)  |
| `npm run test:me`   | Only `getMe()`                             |
| `npm run test:get`  | GET functions (`getMe`, `getPosts`)        |
| `npm run test:post` | POST functions (`createUser`, `loginUser`) |
| `npm run test:crud` | Full CRUD workflow (all functions)         |

## Dynamic Import

Both `post-cli.js` and the test files use the same pattern to decide which services file to load:

```js
let services;
try {
  services = await import('./services.solution.js');
} catch {
  services = await import('./services.js');
}
const { loginUser, getPosts, ... } = services;
```

This means:

- If `services.solution.js` exists, the CLI and tests use it. This file is a reference implementation for instructors so they can quickly demo a working version — it is not intended for you.
- If it doesn't exist, they fall back to your `services.js`.

When you receive this project as a homework assignment, only `services.js` (the starter file) will be present, so the CLI and tests will automatically use your code.
