import fetch from 'node-fetch';
import { AnalysisResult, JournalEntry } from '../models/types';

export class OpenAIService {
  constructor(private apiKey: string) {}

  async analyze(entries: JournalEntry[], period: string = ''): Promise<AnalysisResult> {
    const journalContent = entries
      .map(e => `【${e.date}】\n${e.content}`)
      .join('\n\n');

    const systemPrompt = `あなたは優秀な心理カウンセラーかつライフコーチです。ユーザーの日記を分析し、建設的で温かいフィードバックを提供してください。\n分析は以下の4つの観点から行い、JSON形式で回答してください：\n\n1. summary: 期間全体の総括（200文字程度）\n2. emotionalTrends: 感情の変化やパターン（150文字程度）  \n3. behaviorPatterns: 行動パターンや習慣の分析（150文字程度）\n4. growthPoints: 成長が見られる点や前向きな変化（150文字程度）\n5. recommendations: 今後の改善提案や継続すべきこと（200文字程度）\n\n回答は以下のJSON構造で返してください：\n{\n  "summary": "...",\n  "emotionalTrends": "...",\n  "behaviorPatterns": "...", \n  "growthPoints": "...",\n  "recommendations": "..."}`;

    const userPrompt = `以下は${period}の日記です。上記の観点から分析してください：\n\n${journalContent}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const aiResponse = data.choices?.[0]?.message?.content || '';

      try {
        const parsedResult = JSON.parse(aiResponse);
        return {
          period,
          summary: parsedResult.summary || 'AI分析結果を取得できませんでした',
          emotionalTrends: parsedResult.emotionalTrends || '',
          behaviorPatterns: parsedResult.behaviorPatterns || '',
          growthPoints: parsedResult.growthPoints || '',
          recommendations: parsedResult.recommendations || '',
          generatedAt: new Date(),
        };
      } catch {
        return {
          period,
          summary: aiResponse || 'AI分析結果を取得できませんでした',
          emotionalTrends: '',
          behaviorPatterns: '',
          growthPoints: '',
          recommendations: '',
          generatedAt: new Date(),
        };
      }
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw new Error(`AI分析に失敗しました: ${error.message}`);
    }
  }

  async testApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
