import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-document-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './delete-document-modal.component.html',
  styleUrl: './delete-document-modal.component.css'
})
export class DeleteDocumentModalComponent {
  @Input() documentTitle: string = '';
  @Output() confirmDeleteEvent = new EventEmitter<void>();
  @Output() cancelDeleteEvent = new EventEmitter<void>();

  onConfirmDelete() {
    this.confirmDeleteEvent.emit();
  }

  onCancelDelete() {
    this.cancelDeleteEvent.emit();
  }
}