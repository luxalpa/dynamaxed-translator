import { getPath, readPokeString } from "../util";
import fs from "fs";
import { TrainerClassIDs } from "./trainer-class-ids";

const OFFSET_TRAINER_CLASS_NAMES = 0x324644;
const NUM_TRAINER_CLASSES = 66;
const NAME_LEN = 13;

interface TrainerClass {
  name: string;
}

export function translateTrainerClasses(romData: Buffer, projectPath: string) {
  const path = getPath(projectPath, "trainer-classes.json");

  const trainerClasses: Record<string, TrainerClass> = JSON.parse(
    fs.readFileSync(path).toString()
  );

  const names = readTrainerClassNames(romData);
  names.forEach((name, i) => {
    const id = TrainerClassIDs.get(i);
    if (id === undefined) {
      throw new Error("Trainer Class ID unknown");
    }
    trainerClasses[id].name = name;
  });

  fs.writeFileSync(path, JSON.stringify(trainerClasses));
}

function readTrainerClassNames(buffer: Buffer): string[] {
  const names: string[] = [];

  for (let i = 0; i < NUM_TRAINER_CLASSES; i++) {
    const startPos = OFFSET_TRAINER_CLASS_NAMES + i * NAME_LEN;
    const endPos = startPos + NAME_LEN;

    const { str } = readPokeString(buffer.slice(startPos, endPos));
    names.push(str);
  }
  return names;
}
