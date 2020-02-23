import { getPath, hasKey } from "../util";
import fs from "fs";
import MoveNames from "./move-names.json";
import MoveDescriptions from "./move-descriptions.json";

interface Move {
  name: string;
  description: string;
}

export function translateMoves(projectPath: string) {
  const path = getPath(projectPath, "moves.json");

  const moves: Record<string, Move> = JSON.parse(
    fs.readFileSync(path).toString()
  );

  for (const [id, move] of Object.entries(moves)) {
    if (hasKey(MoveNames, id)) {
      move.name = MoveNames[id];
    }

    if (hasKey(MoveDescriptions, id)) {
      move.description = MoveDescriptions[id];
    }
  }

  fs.writeFileSync(path, JSON.stringify(moves));
}
