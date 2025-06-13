import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css'
})
export class DeleteConfirmationModalComponent {
  @Input() userName: string = '';
  @Output() confirmDeleteEvent = new EventEmitter<void>();
  @Output() cancelDeleteEvent = new EventEmitter<void>();

  onConfirmDelete() {
    console.log('Delete confirmation modal: onConfirmDelete called');
    this.confirmDeleteEvent.emit();
  }

  onCancelDelete() {
    console.log('Delete confirmation modal: onCancelDelete called');
    this.cancelDeleteEvent.emit();
  }
}