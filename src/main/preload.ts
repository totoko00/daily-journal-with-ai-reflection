import { contextBridge, ipcRenderer } from 'electron';
import { JournalEntry } from '../models/types';

contextBridge.exposeInMainWorld('api', {
  saveEntry: (date: string, content: string) => ipcRenderer.invoke('save-entry', date, content),
  loadEntry: (date: string) => ipcRenderer.invoke('load-entry', date),
  analyze: (entries: JournalEntry[], apiKey: string) => ipcRenderer.invoke('analyze', entries, apiKey),
  listEntries: () => ipcRenderer.invoke('list-entries'),
  getRangeEntries: (start: string, end: string) => ipcRenderer.invoke('get-range-entries', start, end),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
});
