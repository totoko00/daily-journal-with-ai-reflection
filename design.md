# Design Document

## Overview

日記アプリケーション「Daily Journal with AI Reflection」は、ユーザーが日々の記録を蓄積し、AI（OpenAI GPT-4.1 mini）による振り返り分析を受けられるデスクトップアプリケーションです。

### 技術選択の理由

**フレームワーク: Electron + TypeScript**
- クロスプラットフォーム対応（Windows、macOS、Linux）
- Web技術（HTML、CSS、JavaScript/TypeScript）を使用した開発
- 豊富なエコシステムと成熟したコミュニティ
- ローカルファイルシステムへの安全なアクセス
- OpenAI APIとの統合が容易

**代替案検討**
- Tauri: より軽量だが、Rustの知識が必要で開発速度が劣る
- Native開発: プラットフォーム固有の知識が必要で開発コストが高い

## Architecture

### システム構成

```
┌─────────────────────────────────────────┐
│              Frontend (Renderer)        │
│  ┌─────────────┐  ┌─────────────────────┐│
│  │   UI Layer  │  │   State Management  ││
│  │             │  │                     ││
│  │ - Journal   │  │ - Journal Store     ││
│  │   Entry     │  │ - Settings Store    ││
│  │ - Reflection│  │ - UI State          ││
│  │   Display   │  │                     ││
│  │ - Settings  │  │                     ││
│  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────┘
                    │
                    │ IPC Communication
                    │
┌─────────────────────────────────────────┐
│              Backend (Main)             │
│  ┌─────────────┐  ┌─────────────────────┐│
│  │File Manager │  │   OpenAI Service    ││
│  │             │  │                     ││
│  │ - Read/Write│  │ - API Integration   ││
│  │   Journal   │  │ - Analysis Logic    ││
│  │   Files     │  │ - Error Handling    ││
│  │ - Settings  │  │                     ││
│  │   Storage   │  │                     ││
│  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────┘
                    │
                    │
┌─────────────────────────────────────────┐
│           External Services             │
│  ┌─────────────┐  ┌─────────────────────┐│
│  │Local Storage│  │    OpenAI API       ││
│  │             │  │                     ││
│  │ - Journal   │  │ - GPT-4.1 mini      ││
│  │   Files     │  │ - Chat Completions  ││
│  │ - Settings  │  │                     ││
│  │   Config    │  │                     ││
│  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────┘
```

## Components and Interfaces

### Frontend Components

#### 1. MainWindow
- **責任**: アプリケーションのメインウィンドウ管理
- **機能**: 
  - ウィンドウの初期化と設定
  - メニューバーの管理
  - 各コンポーネント間の調整

#### 2. JournalEditor
- **責任**: 日記の入力と編集
- **機能**:
  - テキストエリアでの日記入力
  - 文字数カウント表示（最大500文字）
  - 保存機能
  - 日付の自動設定

#### 3. ReflectionPanel
- **責任**: 振り返り機能の提供
- **機能**:
  - 振り返り期間選択ボタン（今週、今月、今年、任意期間）
  - 日付範囲選択UI
  - AI分析結果の表示
  - ローディング状態の管理

#### 4. SettingsDialog
- **責任**: アプリケーション設定の管理
- **機能**:
  - OpenAI APIキーの入力と保存
  - APIキーの有効性テスト
  - 設定の保存と読み込み

#### 5. JournalHistory
- **責任**: 過去の日記の閲覧
- **機能**:
  - 日付別の日記一覧表示
  - 特定の日記の詳細表示
  - 検索機能（オプション）

### Backend Services

#### 1. FileManager
- **責任**: ローカルファイルシステムとの連携
- **インターフェース**:
```typescript
interface FileManager {
  saveJournalEntry(date: string, content: string): Promise<void>
  loadJournalEntry(date: string): Promise<string | null>
  getJournalEntriesInRange(startDate: string, endDate: string): Promise<JournalEntry[]>
  saveSettings(settings: AppSettings): Promise<void>
  loadSettings(): Promise<AppSettings | null>
}
```

#### 2. OpenAIService
- **責任**: OpenAI APIとの通信
- **インターフェース**:
```typescript
interface OpenAIService {
  analyzeJournalEntries(entries: JournalEntry[], period: string): Promise<AnalysisResult>
  testApiKey(apiKey: string): Promise<boolean>
}
```

#### 3. IPCHandler
- **責任**: フロントエンドとバックエンド間の通信
- **機能**:
  - セキュアなIPC通信の管理
  - エラーハンドリング
  - 非同期処理の調整

## Data Models

### JournalEntry
```typescript
interface JournalEntry {
  date: string // YYYY-MM-DD format
  content: string // 最大500文字
  createdAt: Date
  updatedAt: Date
}
```

### AnalysisResult
```typescript
interface AnalysisResult {
  period: string
  summary: string
  emotionalTrends: string
  behaviorPatterns: string
  growthPoints: string
  recommendations: string
  generatedAt: Date
}
```

### AppSettings
```typescript
interface AppSettings {
  openaiApiKey: string
  dataDirectory: string
  windowSettings: {
    width: number
    height: number
    x?: number
    y?: number
  }
}
```

### ReflectionPeriod
```typescript
type ReflectionPeriod = 'week' | 'month' | 'year' | 'custom'

interface CustomPeriod {
  startDate: string
  endDate: string
}
```

## Error Handling

### エラー分類と対応

#### 1. ファイルシステムエラー
- **原因**: ディスク容量不足、権限不足、ファイル破損
- **対応**: 
  - ユーザーフレンドリーなエラーメッセージ表示
  - 自動バックアップ機能
  - 代替保存場所の提案

#### 2. OpenAI APIエラー
- **原因**: APIキー無効、レート制限、ネットワークエラー
- **対応**:
  - APIキー再設定の案内
  - リトライ機能（指数バックオフ）
  - オフライン時の適切な通知

#### 3. データ検証エラー
- **原因**: 不正な日付形式、文字数制限超過
- **対応**:
  - リアルタイム検証とフィードバック
  - 自動修正機能
  - 明確なエラーメッセージ

### エラーログ機能
- ローカルログファイルへの記録
- デバッグ情報の収集
- ユーザープライバシーの保護

## Testing Strategy

### 1. Unit Testing
- **対象**: 各コンポーネントとサービスの個別機能
- **ツール**: Jest + Testing Library
- **カバレッジ**: 80%以上を目標

### 2. Integration Testing
- **対象**: コンポーネント間の連携、IPC通信
- **重点項目**:
  - ファイル保存・読み込み機能
  - OpenAI API連携
  - 設定管理

### 3. End-to-End Testing
- **対象**: ユーザーワークフロー全体
- **ツール**: Playwright for Electron
- **シナリオ**:
  - 日記作成から振り返りまでの完全フロー
  - 設定変更とその反映
  - エラー状況での動作

### 4. Manual Testing
- **対象**: UI/UX、パフォーマンス
- **重点項目**:
  - レスポンシブデザイン
  - アクセシビリティ
  - 長期間使用時の安定性

### テストデータ管理
- モックデータの作成
- テスト環境の分離
- 本番データの保護

## Security Considerations

### 1. APIキー管理
- 暗号化してローカル保存
- メモリ上での適切な管理
- ログへの出力防止

### 2. ファイルアクセス制御
- アプリ専用ディレクトリの使用
- 権限の最小化
- パストラバーサル攻撃の防止

### 3. データプライバシー
- ローカル保存によるプライバシー保護
- 外部送信データの最小化
- ユーザー同意の明確化