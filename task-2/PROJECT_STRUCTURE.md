# Post CLI - Project Structure

```plaintext
task-2/
│
├── README.md                    # Main documentation, API reference, learning objectives
├── README_BACKGROUND.md         # How the CLI, tests, and services fit together
├── PROJECT_STRUCTURE.md         # This file
│
└── post-cli/
    ├── package.json                 # Dependencies and helpful npm scripts
    ├── vitest.config.js             # Vitest test runner configuration
    ├── .gitignore                   # Git ignore rules
    │
    ├── src/                         # Source code
    │   ├── post-cli.js              # Interactive CLI application entry point
    │   ├── services.js              # Trainee working file with API functions to implement
    │   └── services.starter.js      # Original starter file (backup copy)
    │
    └── tests/                       # Vitest test files
        ├── test-get.test.js         # Test GET request functions
        ├── test-post.test.js        # Test POST request functions (+ loginUser)
        └── test-crud.test.js        # Test all CRUD operations
```

## File Purposes

### For Trainees

- **README.md** - Start here! Complete guide to the exercise
- **README_BACKGROUND.md** - Explains how the CLI, tests, and token system work
- **post-cli/src/services.js** - Implement your fetch API functions here
- **post-cli/src/post-cli.js** - Interactive CLI app that imports and runs your functions
- **post-cli/tests/** - Vitest tests to verify your code

### Key Files Explained

- **src/post-cli.js** - Interactive CLI entry point with register/login flow, imports trainee functions
- **src/services.js** - Trainees implement API functions here (token management provided, API functions are TODOs)
- **src/services.starter.js** - Original starter file; if you break `services.js`, copy this back to start over

## Available Commands

```bash
# Main application
npm start              # Run the interactive CLI (src/post-cli.js)

# Testing
npm test               # Run all tests in watch mode
npm run test:run       # Run all tests once
npm run test:me        # Test only getMe()
npm run test:get       # Test GET request functions
npm run test:post      # Test POST request functions (+ loginUser)
npm run test:crud      # Test all CRUD operations
```

## CLI Commands (inside the app)

| Command        | Description          |
| -------------- | -------------------- |
| `/view`        | See all your posts   |
| `/update <id>` | Edit a post          |
| `/delete <id>` | Remove a post        |
| `/leave`       | Delete your account  |
| `/exit`        | Quit the application |
| _(any text)_   | Create a new post    |

## Suggested Learning Path

1. Read README.md
2. Run tests to see expected behavior: `npm test`
3. Open src/services.js and start coding
4. Test frequently: `npm test` (watch mode) or `npm run test:get`, `npm run test:post`
5. Run the app: `npm start` to see your functions in action

## Key Learning Concepts

- Making HTTP requests with fetch()
- Using async/await
- HTTP methods (GET, POST, PUT, DELETE)
- Request headers and body
- Authorization header and JWT tokens
- Public vs protected endpoints
- Response handling and error checking
- Working with JSON
- CRUD operations
