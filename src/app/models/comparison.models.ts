export type DiffKind = 'unchanged' | 'added' | 'removed' | 'modified';

export interface DiffLine {
  kind: DiffKind;
  left?: string;
  right?: string;
  text?: string;
}

export interface CompareOptions {
  ignoreCase: boolean;
  ignoreSpaces: boolean;
  ignoreEmptyLines: boolean;
  ignoreLineBreaks: boolean;
  trimWhitespace: boolean;
}

export interface ComparisonStats {
  totalLines: number;
  linesAdded: number;
  linesRemoved: number;
  linesModified: number;
}

export interface HistoryItem {
  id: string;
  tool: 'text' | 'json' | 'code';
  createdAt: string;
  left: string;
  right: string;
  label: string;
}
