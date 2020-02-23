import path from "path";
import { Charmap } from "./charmap";

export function getPath(projectPath: string, jsonFile: string) {
  return path.join(projectPath, ".dynamaxed", jsonFile);
}

export function readPokeString(
  buffer: Buffer
): { str: string; endpos: number } {
  let str = "";
  let endpos = buffer.length;

  for (let i = 0; i < buffer.length; i++) {
    const c = buffer[i];
    if (c == 255) {
      endpos = i;
      break;
    }
    if (c == 0x53 && buffer[i + 1] == 0x54) {
      str += "{PKMN}";
      i++;
    } else if (
      c == 0x55 &&
      buffer[i + 1] == 0x56 &&
      buffer[i + 2] == 0x57 &&
      buffer[i + 3] == 0x58 &&
      buffer[i + 4] == 0x59
    ) {
      str += "{POKEBLOCK}";
      i += 4;
    } else {
      const char = Charmap.get(c);
      if (char == undefined) {
        throw new Error(
          `Char not valid for 0x${c.toString(16)} at 0x${i.toString(16)}`
        );
      }
      str += char;
    }
  }

  return {
    str,
    endpos
  };
}

export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}
