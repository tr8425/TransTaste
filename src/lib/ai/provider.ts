import { InputType, MenuAnalysisResult, AnalysisError } from '../types';

export interface MenuInput {
  input: string; // base64 image, URL, or text
  inputType: InputType;
  outputLanguage?: string;
  menuLanguage?: string;
  allergenPreset?: string[];
  dietaryBeliefs?: string[];
}

export interface AIProvider {
  name: string;
  analyzeMenu(input: MenuInput): Promise<MenuAnalysisResult | AnalysisError>;
  estimateCost(inputTokens: number, outputTokens: number): number;
}

// Lazy import to avoid circular dependency issues
let _claudeSonnetProvider: AIProvider | null = null;

async function getClaudeSonnetProvider(): Promise<AIProvider> {
  if (!_claudeSonnetProvider) {
    const { claudeSonnetProvider } = await import('./claude');
    _claudeSonnetProvider = claudeSonnetProvider;
  }
  return _claudeSonnetProvider;
}

export async function selectProvider(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputType: InputType
): Promise<AIProvider> {
  // For MVP: all inputs use Claude Sonnet
  // V2: text inputs will route to Haiku for cost savings
  return getClaudeSonnetProvider();
}
