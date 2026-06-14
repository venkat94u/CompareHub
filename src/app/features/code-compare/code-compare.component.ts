import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ComparisonStats, DiffLine, HistoryItem } from '../../models/comparison.models';
import { DiffService } from '../../services/diff.service';
import { SeoService } from '../../services/seo.service';
import { StorageService } from '../../services/storage.service';
import { DropZoneDirective } from '../../shared/drop-zone/drop-zone.directive';
import { HistoryPanelComponent } from '../../shared/history-panel/history-panel.component';
import { ToolShellComponent } from '../../shared/tool-shell/tool-shell.component';

@Component({
  selector: 'app-code-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolShellComponent, DropZoneDirective, HistoryPanelComponent],
  templateUrl: './code-compare.component.html',
  styleUrls: ['./code-compare.component.scss']
})
export class CodeCompareComponent implements OnInit {
  left = '';
  right = '';
  language = 'typescript';
  diff: DiffLine[] = [];
  stats: ComparisonStats | null = null;
  historyItems: HistoryItem[] = [];
  languages = ['typescript', 'javascript', 'html', 'css', 'java', 'python'];

  constructor(
    private readonly diffService: DiffService,
    private readonly storage: StorageService,
    private readonly seo: SeoService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.seo.set('Code Compare | CompareHub', 'Compare TypeScript, JavaScript, HTML, CSS, Java and Python source code locally.', 'code-compare');
    const draft = this.storage.loadDraft('code');
    this.left = draft.left;
    this.right = draft.right;
    this.refreshHistory();
  }

  save(): void {
    this.storage.saveDraft('code', this.left, this.right);
  }

  compare(saveHistory = true): void {
    this.diff = this.diffService.compare(this.left, this.right, {
      ignoreCase: false,
      ignoreSpaces: false,
      ignoreEmptyLines: false,
      ignoreLineBreaks: false,
      trimWhitespace: false
    });
    this.stats = this.diffService.stats(this.diff);
    if (saveHistory) {
      this.storage.addHistory({ tool: 'code', left: this.left, right: this.right, label: `${this.language} code comparison` });
      this.refreshHistory();
    }
    this.save();
  }

  clear(): void {
    this.left = '';
    this.right = '';
    this.diff = [];
    this.stats = null;
    this.storage.clearDraft('code');
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
    link.href = URL.createObjectURL(new Blob([this.diffService.toText(this.diff)], { type: 'text/plain' }));
    link.download = `comparehub-${this.language}-diff.txt`;
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

  highlighted(line: string | undefined): SafeHtml {
    const escaped = this.escape(line ?? '');
    const keywordPattern = /\b(const|let|var|function|return|class|interface|type|import|from|export|if|else|for|while|public|private|def|None|True|False|new|try|catch)\b/g;
    const html = escaped
      .replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, '<span class="token-string">$1</span>')
      .replace(keywordPattern, '<span class="token-keyword">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private refreshHistory(): void {
    this.historyItems = this.storage.history().filter(item => item.tool === 'code').slice(0, 20);
  }
}
