
export type SourceType = 'youtube' | 'article' | 'podcast' | 'note' | 'github' | 'other';

export interface ContentSource {
  id: string;
  title: string;
  url?: string;
  type: SourceType;
  timestamp: number;
  tags: string[];
}

export interface IdeaOutline {
  hook: string;
  mainPoints: string[];
  cta: string;
}

export interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'blog' | 'thread' | 'summary';
  outline: IdeaOutline;
  expiryDate: number;
  relevanceScore: number; // 1-100
}

export interface TopicNode {
  id: string;
  name: string;
  value: number; // frequency/importance
  group: string;
}

export interface InterestMapData {
  nodes: TopicNode[];
  links: { source: string; target: string; value: number }[];
}

export interface LearningStep {
  level: 'Beginner' | 'Intermediate' | 'Expert';
  title: string;
  description: string;
  resources: string[];
}
