import { getPath, hasKey, readPokeString } from "../util";
import fs from "fs";
import PokemonNames from "./pokemon-names.json";
import PokemonNDexOrder from "./pokemon-ndex-order.json";

const OFFSET_DESCRIPTIONS = 0x56f03d;
const NUM_POKEMON = 387;

interface Pokemon {
  name: string;
  description: string;
}

export function translatePokemon(romData: Buffer, projectPath: string) {
  const path = getPath(projectPath, "pokemon.json");

  const descriptions = getDescriptions(romData);

  const monDexIDs = Object.fromEntries(
    PokemonNDexOrder.map((id, i) => [id, i])
  );

  const pokemon: Record<string, Pokemon> = JSON.parse(
    fs.readFileSync(path).toString()
  );

  for (const [id, mon] of Object.entries(pokemon)) {
    if (hasKey(PokemonNames, id)) {
      mon.name = PokemonNames[id];
    }

    if (hasKey(monDexIDs, id)) {
      mon.description = descriptions[monDexIDs[id]];
    }
  }

  fs.writeFileSync(path, JSON.stringify(pokemon));
}

function getDescriptions(romData: Buffer): string[] {
  const descriptions: string[] = [];

  let curPos = OFFSET_DESCRIPTIONS;
  for (let i = 0; i < NUM_POKEMON; i++) {
    const { str, endpos } = readPokeString(romData.slice(curPos));
    curPos += endpos + 1;
    descriptions.push(str);
  }

  return descriptions;
}
