import { promises as fs } from 'fs';
import path from 'path';
import { LibraryItem } from './types';

const STORAGE_PATH = path.join(process.cwd(), 'data', 'library.json');

async function ensureStorageFile() {
  try {
    await fs.access(STORAGE_PATH);
  } catch {
    await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
    await fs.writeFile(STORAGE_PATH, '[]', 'utf-8');
  }
}

/**
 * Read all saved items from local JSON storage.
 */
export async function readLibrary(): Promise<LibraryItem[]> {
  await ensureStorageFile();
  const raw = await fs.readFile(STORAGE_PATH, 'utf-8');
  return JSON.parse(raw) as LibraryItem[];
}

/**
 * Save entire library list to disk.
 */
export async function writeLibrary(items: LibraryItem[]) {
  await ensureStorageFile();
  await fs.writeFile(STORAGE_PATH, JSON.stringify(items, null, 2), 'utf-8');
}
