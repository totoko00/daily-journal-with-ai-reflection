import { promises as fs } from 'fs';
import * as path from 'path';
import { JournalEntry, AppSettings } from '../models/types';

export class FileManager {
  constructor(private dataDir: string, private settingsPath: string) {}

  setDataDir(dir: string) {
    this.dataDir = dir;
  }

  private ensureDir() {
    return fs.mkdir(this.dataDir, { recursive: true });
  }

  async saveJournalEntry(date: string, content: string): Promise<void> {
    await this.ensureDir();
    const file = path.join(this.dataDir, `${date}.txt`);
    await fs.writeFile(file, content, 'utf8');
  }

  async loadJournalEntry(date: string): Promise<string | null> {
    try {
      const file = path.join(this.dataDir, `${date}.txt`);
      return await fs.readFile(file, 'utf8');
    } catch (e) {
      return null;
    }
  }

  async getJournalEntriesInRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    // minimal implementation: read files between dates
    await this.ensureDir();
    const entries: JournalEntry[] = [];
    const files = await fs.readdir(this.dataDir);
    for (const f of files) {
      if (!f.endsWith('.txt')) continue;
      const date = f.replace('.txt', '');
      if (date >= startDate && date <= endDate) {
        const content = await this.loadJournalEntry(date);
        entries.push({ date, content: content || '', createdAt: new Date(date), updatedAt: new Date(date) });
      }
    }
    return entries;
  }

  async listJournalDates(): Promise<string[]> {
    await this.ensureDir();
    const files = await fs.readdir(this.dataDir);
    return files
      .filter(f => f.endsWith('.txt'))
      .map(f => f.replace('.txt', ''))
      .sort();
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await fs.writeFile(this.settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  }

  async loadSettings(): Promise<AppSettings | null> {
    try {
      const text = await fs.readFile(this.settingsPath, 'utf8');
      return JSON.parse(text) as AppSettings;
    } catch {
      return null;
    }
  }
}
