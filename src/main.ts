import fs from "fs";
import { translateTrainers } from "./trainers/trainers";
import { translateTrainerClasses } from "./trainer-classes/trainer-classes";
import { translateMoves } from "./moves/moves";
import { translatePokemon } from "./pokemon/pokemon";
import { translateItems } from "./items/items";

function printUsage() {
  console.log("Usage: translate <Path-To-German-GBA> <Path-to-project>");
}

function main() {
  const [source, projectPath] = process.argv.slice(2);

  if (!source) {
    printUsage();
    process.exit(1);
  }

  if (!projectPath) {
    printUsage();
    process.exit(1);
  }

  const romData = fs.readFileSync(source);

  translateTrainers(romData, projectPath);
  translateTrainerClasses(romData, projectPath);
  translateMoves(projectPath);
  translatePokemon(romData, projectPath);
  translateItems(romData, projectPath);
}

try {
  main();
} catch (e) {
  throw e;
}
