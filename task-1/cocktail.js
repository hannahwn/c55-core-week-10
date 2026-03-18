// API documentation: https://www.thecocktaildb.com/api.php

import { error } from "console";
import path from "path";
import { writeFile } from "fs/promises";

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Add helper functions as needed here

export async function main() {
  if (process.argv.length < 3) {
    console.error("Please provide a cocktail name as a command line argument.");
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `./output/${cocktailName}.md`);

  try {
    // 1. Fetch data from the API at the given URL
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`,
    );

    const data = await response.json();

    // 2. Generate markdown content to match the examples

    let markdown = `# Cocktail Recipes\n\n`;

    if (!data.drinks || data.drinks.length === 0) {
      throw new Error("No cocktails found with that name.");
    } else {
      for (const drink of data.drinks) {
        markdown += `## ${drink.strDrink}\n\n`;

        // Use  strDrinkThumb medium
        if (drink.strDrinkThumb) {
          const thumbUrl = `${drink.strDrinkThumb}/medium`;
          markdown += `![${drink.strDrink}](${thumbUrl})\n\n`;
        }

        // Category & Alcoholic
        markdown += `**Category**: ${drink.strCategory || "Unknown"}\n`;

        let alcoholicText = "—";
        if (drink.strAlcoholic === "Alcoholic") {
          alcoholicText = "Yes";
        } else if (
          drink.strAlcoholic === "Non alcoholic" ||
          drink.strAlcoholic === "Non-Alcoholic"
        ) {
          alcoholicText = "No";
        }
        markdown += `**Alcoholic**: ${alcoholicText}\n\n`;

        // Ingredients
        markdown += `### Ingredients\n\n`;
        let ingredientCount = 0;

        for (let i = 1; i <= 15; i++) {
          const ingredient = drink[`strIngredient${i}`];
          if (ingredient && ingredient.trim()) {
            ingredientCount++;
            const measure = drink[`strMeasure${i}`]?.trim() || "";
            const line = measure ? `${measure} ${ingredient}` : ingredient;
            markdown += `- ${line}\n`;
          }
        }

        if (ingredientCount === 0) {
          markdown += `- No ingredients listed\n`;
        }
        markdown += `\n`;

        // Instructions
        markdown += `### Instructions\n${drink.strInstructions || "No instructions provided."}\n\n`;

        // Glass
        markdown += `Serve in: ${drink.strGlass || "Unknown"}\n\n`;

        markdown += `---\n\n`;
      }
    }

    // 3. Write the generated content to a markdown file as given by outPath
    await writeFile(outPath, markdown, "utf-8");
    console.log(`Successfully wrote to ${outPath}`);
  } catch (error) {
    // 4. Handle errors
    console.error(error.message);
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
