
export enum ViewMode {
  CITIZEN_CHAT = 'CITIZEN_CHAT',
  FORENSIC_PANEL = 'FORENSIC_PANEL'
}

export interface VerificationResult {
  score: number;
  verdict: string;
  reasoning: string;
  intentAnalysis: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  sources: { title: string; uri: string }[];
  multimodalChecks?: {
    audioDeepfake?: string;
    visualConsistency?: string;
    darkPatterns?: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  result?: VerificationResult;
}
