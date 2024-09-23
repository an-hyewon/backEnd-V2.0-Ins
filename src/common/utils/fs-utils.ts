import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export async function writeToFile(
  filename: string,
  content: string,
): Promise<any> {
  try {
    await writeFile(filename, content, 'utf8');
    console.log(`File ${filename} has been written.`);
    return { success: true, filename: filename };
  } catch (err) {
    console.error(`Error writing to file ${filename}:`, err);
    throw err;
  }
}

export async function readFromFile(filename: string): Promise<string> {
  try {
    const data = await readFile(filename, 'utf8');
    console.log(`File ${filename} has been read.`);
    return data;
  } catch (err) {
    console.error(`Error reading file ${filename}:`, err);
    throw err;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    await unlink(filename);
    console.log(`File ${filename} has been deleted.`);
  } catch (err) {
    console.error(`Error deleting file ${filename}:`, err);
    throw err;
  }
}
