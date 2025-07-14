export enum FeatureKey {
  HOME = 'HOME',
  HEALTH_QA = 'HEALTH_QA',
  DIETARY_LIFESTYLE = 'DIETARY_LIFESTYLE',
}

export interface FeatureConfig {
  key: FeatureKey;
  name: string;
  description: string;
  roles: ('patient' | 'clinician' | 'both')[];
  icon: React.ReactElement<{ className?: string }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  sources?: GroundingSource[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}