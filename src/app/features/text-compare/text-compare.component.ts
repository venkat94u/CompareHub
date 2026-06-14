import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompareOptions, ComparisonStats, DiffLine, HistoryItem } from '../../models/comparison.models';
import { DiffService } from '../../services/diff.service';
import { SeoService } from '../../services/seo.service';
import { StorageService } from '../../services/storage.service';
import { DropZoneDirective } from '../../shared/drop-zone/drop-zone.directive';
import { HistoryPanelComponent } from '../../shared/history-panel/history-panel.component';
import { ToolShellComponent } from '../../shared/tool-shell/tool-shell.component';

@Component({
  selector: 'app-text-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolShellComponent, DropZoneDirective, HistoryPanelComponent],
  templateUrl: './text-compare.component.html',
  styleUrls: ['./text-compare.component.scss']
})
export class TextCompareComponent implements OnInit {
  left = '';
  right = '';
  viewMode: 'side' | 'inline' = 'side';
  diff: DiffLine[] = [];
  stats: ComparisonStats | null = null;
  historyItems: HistoryItem[] = [];
  options: CompareOptions = {
    ignoreCase: false,
    ignoreSpaces: false,
    ignoreEmptyLines: false,
    ignoreLineBreaks: false,
    trimWhitespace: true
  };

  constructor(
    private readonly diffService: DiffService,
    private readonly storage: StorageService,
    private readonly seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.set('Text Compare | CompareHub', 'Compare text side by side or inline in your browser.', 'text-compare');
    const draft = this.storage.loadDraft('text');
    this.left = draft.left;
    this.right = draft.right;
    this.refreshHistory();
    if (this.left || this.right) this.compare(false);
  }

  @HostListener('window:keydown', ['$event'])
  shortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.compare();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.clear();
    }
  }

  save(): void {
    this.storage.saveDraft('text', this.left, this.right);
  }

  compare(saveHistory = true): void {
    const started = performance.now();
    this.diff = this.diffService.compare(this.left, this.right, this.options);
    this.stats = this.diffService.stats(this.diff);
    if (saveHistory) {
      this.storage.addHistory({ tool: 'text', left: this.left, right: this.right, label: `Text comparison ${Math.round(performance.now() - started)}ms` });
      this.refreshHistory();
    }
    this.save();
  }

  clear(): void {
    this.left = '';
    this.right = '';
    this.diff = [];
    this.stats = null;
    this.storage.clearDraft('text');
  }

  restoreHistory(item: HistoryItem): void {
    this.left = item.left;
    this.right = item.right;
    this.compare(false);
  }

  async copyResults(): Promise<void> {
    await navigator.clipboard.writeText(this.diffService.toText(this.diff));
  }

  downloadResults(): void {
    this.download('comparehub-text-diff.txt', this.diffService.toText(this.diff));
  }

  dropped(value: string, side: 'left' | 'right'): void {
    if (side === 'left') this.left = value;
    else this.right = value;
    this.save();
  }

  fullscreen(): void {
    document.documentElement.requestFullscreen?.();
  }

  private download(filename: string, content: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private refreshHistory(): void {
    this.historyItems = this.storage.history().filter(item => item.tool === 'text').slice(0, 20);
  }
}
