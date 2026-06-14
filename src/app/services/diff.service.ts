import { Injectable } from '@angular/core';
import { CompareOptions, ComparisonStats, DiffLine } from '../models/comparison.models';

@Injectable({ providedIn: 'root' })
export class DiffService {
  compare(left: string, right: string, options: CompareOptions): DiffLine[] {
    const leftLines = this.prepare(left, options);
    const rightLines = this.prepare(right, options);
    const max = Math.max(leftLines.length, rightLines.length);
    const rows: DiffLine[] = [];

    for (let i = 0; i < max; i++) {
      const originalLeft = leftLines[i]?.original;
      const originalRight = rightLines[i]?.original;
      const normalizedLeft = leftLines[i]?.normalized;
      const normalizedRight = rightLines[i]?.normalized;

      if (originalLeft === undefined) {
        rows.push({ kind: 'added', right: originalRight, text: originalRight });
      } else if (originalRight === undefined) {
        rows.push({ kind: 'removed', left: originalLeft, text: originalLeft });
      } else if (normalizedLeft === normalizedRight) {
        rows.push({ kind: 'unchanged', left: originalLeft, right: originalRight, text: originalRight });
      } else {
        rows.push({ kind: 'modified', left: originalLeft, right: originalRight, text: originalRight });
      }
    }

    return rows;
  }

  stats(lines: DiffLine[]): ComparisonStats {
    return {
      totalLines: lines.length,
      linesAdded: lines.filter(line => line.kind === 'added').length,
      linesRemoved: lines.filter(line => line.kind === 'removed').length,
      linesModified: lines.filter(line => line.kind === 'modified').length
    };
  }

  toText(lines: DiffLine[]): string {
    return lines.map(line => {
      const marker = line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : line.kind === 'modified' ? '~' : ' ';
      return `${marker} ${line.text ?? line.right ?? line.left ?? ''}`;
    }).join('\n');
  }

  private prepare(value: string, options: CompareOptions): Array<{ original: string; normalized: string }> {
    const source = options.ignoreLineBreaks ? value.replace(/\r?\n/g, ' ') : value;
    return source
      .split(/\r?\n/)
      .map(original => {
        let normalized = options.trimWhitespace ? original.trim() : original;
        if (options.ignoreSpaces) normalized = normalized.replace(/\s+/g, '');
        if (options.ignoreCase) normalized = normalized.toLowerCase();
        return { original, normalized };
      })
      .filter(line => !options.ignoreEmptyLines || line.normalized.length > 0);
  }
}
