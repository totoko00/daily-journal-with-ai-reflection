interface Window {
  api: {
    saveEntry(date: string, content: string): Promise<void>;
    loadEntry(date: string): Promise<string | null>;
    analyze(entries: any[], apiKey: string): Promise<any>;
  };
}
