import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDropZone]',
  standalone: true
})
export class DropZoneDirective {
  @Output() fileDropped = new EventEmitter<string>();
  @HostBinding('class.is-dragging') isDragging = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  @HostListener('dragleave')
  onDragLeave(): void {
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.fileDropped.emit(await file.text());
  }
}
