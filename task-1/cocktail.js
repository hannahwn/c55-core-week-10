// API documentation: https://www.thecocktaildb.com/api.php

import { error } from 'console';
import path from 'path';
import fs from `fs/promises`

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// Add helper functions as needed here

export async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide a cocktail name as a command line argument.');
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `./output/${cocktailName}.md`);

  try {
    // 1. Fetch data from the API at the given URL
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1`);
    if(!response.ok){
      const error = new error("Error with API");
      throw error;
    }
    const data = await response.json();

  
  if (!data.drinks || data.drinks.length === 0) {
    throw new Error(`No cocktails found for "${cocktailName}"`);
  }
    // 2. Generate markdown content to match the examples
    // 3. Write the generated content to a markdown file as given by outPath
  } catch (error) {
    // 4. Handle errors
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
