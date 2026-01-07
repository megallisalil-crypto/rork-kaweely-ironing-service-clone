export type VoiceCommandType =
  | 'navigation'
  | 'order'
  | 'cart'
  | 'wallet'
  | 'profile'
  | 'search'
  | 'action'
  | 'unknown';

export interface VoiceCommand {
  type: VoiceCommandType;
  action: string;
  params?: Record<string, any>;
  confidence: number;
  transcript: string;
}

export interface VoiceCommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface CommandSuggestion {
  text: string;
  description: string;
  category: string;
}
