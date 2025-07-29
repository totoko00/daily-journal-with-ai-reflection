import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { FileManager } from './FileManager';
import { OpenAIService } from './OpenAIService';
import { validateJournalEntry } from '../models/utils';

const dataDir = path.join(app.getPath('userData'), 'journals');
const fileManager = new FileManager(dataDir);
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('save-entry', async (event, date: string, content: string) => {
  if (!validateJournalEntry(content)) throw new Error('invalid');
  await fileManager.saveJournalEntry(date, content);
});

ipcMain.handle('load-entry', async (event, date: string) => {
  return fileManager.loadJournalEntry(date);
});

ipcMain.handle('list-entries', async () => {
  return fileManager.listJournalDates();
});

ipcMain.handle('get-range-entries', async (event, start: string, end: string) => {
  return fileManager.getJournalEntriesInRange(start, end);
});

ipcMain.handle('save-settings', async (event, settings) => {
  await fileManager.saveSettings(settings);
});

ipcMain.handle('load-settings', async () => {
  return fileManager.loadSettings();
});

ipcMain.handle('analyze', async (event, entries, apiKey: string) => {
  const service = new OpenAIService(apiKey);
  return service.analyze(entries);
});
