import { getPath, readPokeString } from "../util";
import fs from "fs";
import { TrainerIDs } from "./trainer-ids";

const NUM_TRAINERS = 855;
const TRAINER_SIZE = 0x28;
const TRAINER_NAME_LEN = 12;
const OFFSET_TRAINERS = 0x3249a0;

interface Trainer {
  trainerName: string;
}

export function translateTrainers(gbaData: Buffer, projectPath: string) {
  const trainerPath = getPath(projectPath, "trainers.json");
  const trainers: Record<string, Trainer> = JSON.parse(
    fs.readFileSync(trainerPath).toString()
  );

  const names = readTrainerNames(gbaData);
  names.forEach((name, i) => {
    const id = TrainerIDs.get(i);
    if (id === undefined) {
      throw new Error("Trainer ID unknown");
    }
    trainers[id].trainerName = name;
  });

  fs.writeFileSync(trainerPath, JSON.stringify(trainers));
}

function readTrainerNames(buffer: Buffer): string[] {
  const trainers: string[] = [];

  for (let i = 0; i < NUM_TRAINERS; i++) {
    const startPos = OFFSET_TRAINERS + i * TRAINER_SIZE + 4;
    const endPos = startPos + TRAINER_NAME_LEN;

    const { str } = readPokeString(buffer.slice(startPos, endPos));
    trainers.push(str);
  }
  return trainers;
}
