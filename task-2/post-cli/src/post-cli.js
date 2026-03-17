import chalk from 'chalk';
import { select, confirm } from '@inquirer/prompts';
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Import fetcher functions
let services;
try {
  services = await import('./services.solution.js');
} catch {
  services = await import('./services.js');
}

const {
  createPost,
  createUser,
  deletePost,
  deleteUser,
  getHello,
  getPosts,
  loginUser,
  setToken,
  updatePost,
} = services;

// ============================================================================
// MAIN APPLICATION - CLI entry point (provided ready-made)
// ============================================================================

/**
 * Prompt for a password with masked input
 * @param {string} message - The prompt message
 * @returns {string} The entered password
 */
const promptPassword = (message) => {
  return prompt(message, { echo: '*' }).trim();
};

/**
 * Register a new user through interactive prompts
 * @returns {Promise<string>} The registered username
 */
const registerNewUser = async () => {
  const name = prompt('Enter your name: ').trim();
  if (!name) {
    console.log(chalk.red('Name cannot be empty.'));
    return null;
  }

  const password = promptPassword('Enter a password: ');
  if (!password) {
    console.log(chalk.red('Password cannot be empty.'));
    return null;
  }

  try {
    const data = await createUser(name, password);
    setToken(data.token);
    console.log(chalk.green(`  User ${name} registered successfully!`));
    return name;
  } catch (error) {
    console.log(chalk.red(error.message));
    return null;
  }
};

/**
 * Log in an existing user through interactive prompts
 * @returns {Promise<string>} The logged-in username
 */
const loginExistingUser = async () => {
  const name = prompt('Enter your name: ').trim();
  if (!name) {
    console.log(chalk.red('Name cannot be empty.'));
    return null;
  }

  const password = promptPassword('Enter your password: ');
  if (!password) {
    console.log(chalk.red('Password cannot be empty.'));
    return null;
  }

  try {
    const data = await loginUser(name, password);
    setToken(data.token);
    console.log(chalk.green(`  Welcome back, ${name}!`));
    return name;
  } catch (error) {
    console.log(chalk.red(error.message));
    return null;
  }
};

/**
 * Present the authentication menu (register, login, or exit)
 * @returns {Promise<string>} The authenticated username
 */
const chooseAuthAction = async () => {
  try {
    const hello = await getHello();
    console.log(chalk.cyan(`\n${hello.text}`));
  } catch {
    console.log(
      chalk.red('\nCould not connect to the server. Is it running?')
    );
    process.exit(1);
  }

  while (true) {
    const choice = await select({
      message: 'What would you like to do?',
      choices: [
        { name: 'Login (existing user)', value: 'login' },
        { name: 'Register (new user)', value: 'register' },
        { name: 'Exit', value: 'exit' },
      ],
    });

    switch (choice) {
      case 'register': {
        const name = await registerNewUser();
        if (name) return name;
        break;
      }
      case 'login': {
        const name = await loginExistingUser();
        if (name) return name;
        break;
      }
      case 'exit':
        console.log(chalk.yellow('Goodbye!'));
        process.exit(0);
    }
  }
};

/**
 * Handle the /exit command
 */
const handleExitCommand = () => {
  console.log(chalk.yellow('Exiting the post-cli note app. Goodbye!'));
  process.exit(0);
};

/**
 * Handle the /leave command (delete account)
 */
const handleLeaveCommand = async () => {
  const confirmed = await confirm({
    message: 'Are you sure you want to delete your account?',
    default: false,
  });
  if (!confirmed) {
    console.log(chalk.blue('Account deletion cancelled.'));
    return;
  }
  await deleteUser();
  console.log(chalk.yellow('Your account has been deleted. Goodbye!'));
  process.exit(0);
};

/**
 * Handle the /view command (display all posts)
 */
const handleViewCommand = async () => {
  const posts = await getPosts();
  console.log(chalk.cyan('\nAll Posts:'));
  if (posts.length === 0) {
    console.log(chalk.gray('  No posts yet. Be the first to post!'));
  } else {
    posts.forEach((post) => {
      console.log(chalk.gray(`  [${post.id}] ${post.user}: ${post.text}`));
    });
  }
};

/**
 * Handle creating a new post
 * @param {string} input - The post text
 */
const handleCreatePost = async (input) => {
  const data = await createPost(input);
  console.log(chalk.green(`  Post created with ID: ${data.id}`));
};

/**
 * Run the main application loop
 */
const runMainLoop = async () => {
  while (true) {
    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { name: 'Create a new post', value: 'create' },
        { name: 'View my posts', value: 'view' },
        { name: 'Update a post', value: 'update' },
        { name: 'Delete a post', value: 'delete' },
        { name: 'Delete my account', value: 'leave' },
        { name: 'Exit', value: 'exit' },
      ],
    });

    try {
      switch (action) {
        case 'create': {
          const text = prompt('Enter your post: ').trim();
          if (!text) {
            console.log(chalk.red('Message cannot be empty.'));
            break;
          }
          await handleCreatePost(text);
          break;
        }

        case 'view':
          await handleViewCommand();
          break;

        case 'update': {
          await handleViewCommand();
          const updateId = parseInt(prompt('Enter post ID to update: ').trim());
          if (isNaN(updateId)) {
            console.log(chalk.red('Invalid post ID.'));
            break;
          }
          const newText = prompt('Enter new text: ').trim();
          if (!newText) {
            console.log(chalk.red('Text cannot be empty.'));
            break;
          }
          await updatePost(updateId, newText);
          console.log(chalk.green(`  Post ${updateId} updated successfully`));
          break;
        }

        case 'delete': {
          await handleViewCommand();
          const deleteId = parseInt(prompt('Enter post ID to delete: ').trim());
          if (isNaN(deleteId)) {
            console.log(chalk.red('Invalid post ID.'));
            break;
          }
          await deletePost(deleteId);
          console.log(chalk.green(`  Post ${deleteId} deleted successfully`));
          break;
        }

        case 'leave':
          await handleLeaveCommand();
          break;

        case 'exit':
          handleExitCommand();
          break;
      }
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  }
};

/**
 * Main application entry point
 */
const main = async () => {
  try {
    await chooseAuthAction();
    await runMainLoop();
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1);
  }
};

main();
