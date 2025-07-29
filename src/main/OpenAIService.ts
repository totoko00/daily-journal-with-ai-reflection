import fetch from 'node-fetch';
import { AnalysisResult, JournalEntry } from '../models/types';

export class OpenAIService {
  constructor(private apiKey: string) {}

  async analyze(entries: JournalEntry[]): Promise<AnalysisResult> {
    const content = entries.map(e => e.content).join('\n');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `Analyze my journal:\n${content}` }],
      }),
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || '';
    return {
      period: '',
      summary,
      emotionalTrends: '',
      behaviorPatterns: '',
      growthPoints: '',
      recommendations: '',
      generatedAt: new Date(),
    };
  }
}
