export enum RoastLevel {
  MILD = 'MILD',
  SPICY = 'SPICY',
  SCORCHED_EARTH = 'SCORCHED_EARTH',
}

export type Language = 'ENGLISH' | 'HINDI';

export interface RoastSection {
  title: string;
  content: string[]; // Bullet points
}

export interface RoastResponse {
  oneLiner: string;
  sections: RoastSection[];
  score: number; // 0-100
}

export interface FileData {
  file: File;
  base64: string;
  mimeType: string;
}

export type LoadingState = 'IDLE' | 'READING' | 'ROASTING' | 'DONE' | 'ERROR';