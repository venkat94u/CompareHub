import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'comparehub.theme';
  private readonly modeSubject = new BehaviorSubject<ThemeMode>(this.initialMode());
  readonly mode$ = this.modeSubject.asObservable();

  constructor() {
    this.apply(this.modeSubject.value);
  }

  toggle(): void {
    const next = this.modeSubject.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.key, next);
    this.modeSubject.next(next);
    this.apply(next);
  }

  private initialMode(): ThemeMode {
    const saved = localStorage.getItem(this.key) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(mode: ThemeMode): void {
    document.documentElement.dataset['theme'] = mode;
  }
}
