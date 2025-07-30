interface Window {
  api: {
    saveEntry(date: string, content: string): Promise<void>;
    loadEntry(date: string): Promise<string | null>;
    analyze(entries: any[], apiKey: string): Promise<any>;
    listEntries(): Promise<string[]>;
    getRangeEntries(start: string, end: string): Promise<any[]>;
    saveSettings(settings: any): Promise<void>;
    loadSettings(): Promise<any | null>;
    selectDirectory(): Promise<string | null>;
  };
}
