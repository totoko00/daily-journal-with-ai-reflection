import { promises as fs } from 'fs';
import * as path from 'path';
import { JournalEntry, AppSettings } from '../models/types';

export class FileManager {
  constructor(private baseDir: string) {}

  private ensureDir() {
    return fs.mkdir(this.baseDir, { recursive: true });
  }

  async saveJournalEntry(date: string, content: string): Promise<void> {
    await this.ensureDir();
    const file = path.join(this.baseDir, `${date}.txt`);
    await fs.writeFile(file, content, 'utf8');
  }

  async loadJournalEntry(date: string): Promise<string | null> {
    try {
      const file = path.join(this.baseDir, `${date}.txt`);
      return await fs.readFile(file, 'utf8');
    } catch (e) {
      return null;
    }
  }

  async getJournalEntriesInRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    // minimal implementation: read files between dates
    await this.ensureDir();
    const entries: JournalEntry[] = [];
    const files = await fs.readdir(this.baseDir);
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

  async saveSettings(settings: AppSettings): Promise<void> {
    await this.ensureDir();
    const file = path.join(this.baseDir, 'settings.json');
    await fs.writeFile(file, JSON.stringify(settings, null, 2), 'utf8');
  }

  async loadSettings(): Promise<AppSettings | null> {
    try {
      const file = path.join(this.baseDir, 'settings.json');
      const text = await fs.readFile(file, 'utf8');
      return JSON.parse(text) as AppSettings;
    } catch {
      return null;
    }
  }
}
