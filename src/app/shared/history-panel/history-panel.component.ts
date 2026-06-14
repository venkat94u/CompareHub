import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryItem } from '../../models/comparison.models';

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.scss']
})
export class HistoryPanelComponent {
  @Input() items: HistoryItem[] = [];
  @Output() restore = new EventEmitter<HistoryItem>();

  preview(item: HistoryItem): string {
    const text = `${item.left || item.right}`.replace(/\s+/g, ' ').trim();
    return text.length > 96 ? `${text.slice(0, 96)}...` : text || 'Empty comparison';
  }
}
