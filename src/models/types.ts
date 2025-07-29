export interface JournalEntry {
  date: string; // YYYY-MM-DD
  content: string; // 最大500文字
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisResult {
  period: string;
  summary: string;
  emotionalTrends: string;
  behaviorPatterns: string;
  growthPoints: string;
  recommendations: string;
  generatedAt: Date;
}

export interface AppSettings {
  openaiApiKey: string;
  dataDirectory: string;
  windowSettings: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

export type ReflectionPeriod = 'week' | 'month' | 'year' | 'custom';
export interface CustomPeriod {
  startDate: string;
  endDate: string;
}
