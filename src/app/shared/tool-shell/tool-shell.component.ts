import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComparisonStats } from '../../models/comparison.models';

@Component({
  selector: 'app-tool-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-shell.component.html',
  styleUrls: ['./tool-shell.component.scss']
})
export class ToolShellComponent {
  @Input() eyebrow = '';
  @Input() heading = '';
  @Input() description = '';
  @Input() stats: ComparisonStats | null = null;
  @Output() fullscreen = new EventEmitter<void>();
}
