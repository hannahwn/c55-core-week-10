## Introduction

In this task you will build a command-line tool that fetches cocktail recipes from an API and writes the results to a markdown file. All your work will be in the file `task-1/cocktail.js`.

The starter code already handles command-line arguments and sets up the output path for you. Your job is to fill in the `try/catch` block with working code. You may add helper functions above `main()` as needed.

### Getting started

1. Run the program with a cocktail name:

   ```bash
   node task-1/cocktail.js margarita
   ```

2. When finished, the program should create a file `task-1/output/margarita.md`.
3. Run the tests to check your work: `npm run test:cocktail`

### What you need to do

Complete the four numbered steps inside `main()`:

1. **Fetch data from the API** — Use `fetch()` with `async/await` to call the API at the given `url`. Parse the JSON response. If the response is not OK, throw an error.
2. **Generate markdown content** — Transform the returned drink data into a markdown string. The API may return multiple drinks for a single search term (e.g. searching "margarita" returns several variations). Your output must include all of them.
3. **Write the file** — Use `fs/promises` (`writeFile`) to write the generated markdown to the file path given by `outPath`.
4. **Handle errors** — In the `catch` block, log a helpful error message to the console.

### Expected output format

Look at the example files in `task-1/examples/` to see exactly what your output should look like. Each drink should include:

- A level-2 heading (`##`) with the drink name
- A thumbnail image (use the URL from `strDrinkThumb` with `/medium` appended)
- **Category** and **Alcoholic** (Yes/No) fields
- A list of ingredients with their measures
- Instructions and the glass to serve in

### API reference

The API documentation is at: https://www.thecocktaildb.com/api.php

The search endpoint used in the starter code returns an object with a `drinks` array. Each drink object has properties like `strDrink`, `strDrinkThumb`, `strCategory`, `strAlcoholic`, `strInstructions`, `strGlass`, and numbered ingredient/measure pairs (`strIngredient1`…`strIngredient15`, `strMeasure1`…`strMeasure15`). Not all ingredient slots are filled — stop when the value is `null` or empty.

### Tips

- You will need to import `fs` from `'fs/promises'` to write the file.
- The API can return `null` for the `drinks` property if no cocktail is found — handle this case.
- Ingredient/measure pairs are numbered 1–15. Loop through them and skip any that are empty or `null`.
- Compare your output against the example files to make sure formatting matches.
