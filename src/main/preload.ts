import { contextBridge, ipcRenderer } from 'electron';
import { JournalEntry } from '../models/types';

contextBridge.exposeInMainWorld('api', {
  saveEntry: (date: string, content: string) => ipcRenderer.invoke('save-entry', date, content),
  loadEntry: (date: string) => ipcRenderer.invoke('load-entry', date),
  analyze: (entries: JournalEntry[], apiKey: string) => ipcRenderer.invoke('analyze', entries, apiKey),
});
