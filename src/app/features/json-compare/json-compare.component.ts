import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComparisonStats, DiffLine, HistoryItem } from '../../models/comparison.models';
import { DiffService } from '../../services/diff.service';
import { SeoService } from '../../services/seo.service';
import { StorageService } from '../../services/storage.service';
import { DropZoneDirective } from '../../shared/drop-zone/drop-zone.directive';
import { HistoryPanelComponent } from '../../shared/history-panel/history-panel.component';
import { ToolShellComponent } from '../../shared/tool-shell/tool-shell.component';

@Component({
  selector: 'app-json-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolShellComponent, DropZoneDirective, HistoryPanelComponent],
  templateUrl: './json-compare.component.html',
  styleUrls: ['./json-compare.component.scss']
})
export class JsonCompareComponent implements OnInit {
  left = '';
  right = '';
  message = '';
  diff: DiffLine[] = [];
  stats: ComparisonStats | null = null;
  historyItems: HistoryItem[] = [];

  constructor(
    private readonly diffService: DiffService,
    private readonly storage: StorageService,
    private readonly seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.set('JSON Compare | CompareHub', 'Validate, pretty format and compare JSON locally in your browser.', 'json-compare');
    const draft = this.storage.loadDraft('json');
    this.left = draft.left;
    this.right = draft.right;
    this.refreshHistory();
  }

  @HostListener('window:keydown', ['$event'])
  shortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.compare();
    }
  }

  save(): void {
    this.storage.saveDraft('json', this.left, this.right);
  }

  validate(): void {
    this.parse(this.left);
    this.parse(this.right);
    this.message = 'Both JSON documents are valid.';
  }

  pretty(): void {
    this.left = this.prettyOne(this.left);
    this.right = this.prettyOne(this.right);
    this.save();
  }

  compare(saveHistory = true): void {
    try {
      const left = this.prettyOne(this.left);
      const right = this.prettyOne(this.right);
      this.diff = this.diffService.compare(left, right, {
        ignoreCase: false,
        ignoreSpaces: false,
        ignoreEmptyLines: false,
        ignoreLineBreaks: false,
        trimWhitespace: true
      });
      this.stats = this.diffService.stats(this.diff);
      this.message = 'JSON comparison complete.';
      if (saveHistory) {
        this.storage.addHistory({ tool: 'json', left: this.left, right: this.right, label: 'JSON comparison' });
        this.refreshHistory();
      }
      this.save();
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Invalid JSON.';
    }
  }

  clear(): void {
    this.left = '';
    this.right = '';
    this.diff = [];
    this.stats = null;
    this.message = '';
    this.storage.clearDraft('json');
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
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([this.diffService.toText(this.diff)], { type: 'application/json' }));
    link.download = 'comparehub-json-diff.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  dropped(value: string, side: 'left' | 'right'): void {
    if (side === 'left') this.left = value;
    else this.right = value;
    this.save();
  }

  fullscreen(): void {
    document.documentElement.requestFullscreen?.();
  }

  private prettyOne(value: string): string {
    return JSON.stringify(this.parse(value), null, 2);
  }

  private parse(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error('Invalid JSON. Check commas, quotes and brackets.');
    }
  }

  private refreshHistory(): void {
    this.historyItems = this.storage.history().filter(item => item.tool === 'json').slice(0, 20);
  }
}
