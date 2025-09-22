export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AIRequest {
  action: 'polish' | 'generate_title' | 'generate_tags';
  text: string;
}

export interface AIResponse {
  result: string | string[];
}