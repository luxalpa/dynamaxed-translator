import { getPath, hasKey, readPokeString } from "../util";
import fs from "fs";
import ItemIDs from "./item-ids.json";

const OFFSET_DESCRIPTIONS = 0x590ca8;
const OFFSET_ITEMS = 0x5946dc;
const ITEM_NAME_LEN = 14;
const ITEM_SIZE = 44;
const NUM_ITEMS = 377;

interface Item {
  name: string;
  description: string;
}

export function translateItems(romData: Buffer, projectPath: string) {
  const path = getPath(projectPath, "items.json");

  const items: Record<string, Item> = JSON.parse(
    fs.readFileSync(path).toString()
  );

  const itemsDE = readItems(romData);

  for (const [id, item] of Object.entries(items)) {
    if (hasKey(ItemIDs, id)) {
      const newItem = itemsDE[ItemIDs[id]];
      item.name = newItem.name;
      item.description = newItem.description;
    }
  }

  fs.writeFileSync(path, JSON.stringify(items));
}

function readItems(romData: Buffer): Item[] {
  const items: Item[] = [];
  let curPos = OFFSET_ITEMS;
  for (let i = 0; i < NUM_ITEMS; i++) {
    const { str: name } = readPokeString(romData.slice(curPos, ITEM_NAME_LEN));
    const offsetDesc = romData.readInt32LE(curPos + 20) - 0x8000000;
    const { str: description } = readPokeString(romData.slice(offsetDesc));
    items.push({
      name,
      description
    });
    curPos += ITEM_SIZE;
  }

  return items;
}
