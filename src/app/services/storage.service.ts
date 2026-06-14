import { Injectable } from '@angular/core';
import { HistoryItem } from '../models/comparison.models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly historyKey = 'comparehub.history';

  loadDraft(tool: string): { left: string; right: string } {
    return {
      left: localStorage.getItem(`comparehub.${tool}.left`) ?? '',
      right: localStorage.getItem(`comparehub.${tool}.right`) ?? ''
    };
  }

  saveDraft(tool: string, left: string, right: string): void {
    localStorage.setItem(`comparehub.${tool}.left`, left);
    localStorage.setItem(`comparehub.${tool}.right`, right);
  }

  clearDraft(tool: string): void {
    localStorage.removeItem(`comparehub.${tool}.left`);
    localStorage.removeItem(`comparehub.${tool}.right`);
  }

  history(): HistoryItem[] {
    return JSON.parse(localStorage.getItem(this.historyKey) ?? '[]') as HistoryItem[];
  }

  addHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): void {
    const next: HistoryItem = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString()
    };
    const counts: Partial<Record<HistoryItem['tool'], number>> = {};
    const items = [next, ...this.history()].filter(historyItem => {
      const count = counts[historyItem.tool] ?? 0;
      if (count >= 20) return false;
      counts[historyItem.tool] = count + 1;
      return true;
    });
    localStorage.setItem(this.historyKey, JSON.stringify(items));
  }
}
