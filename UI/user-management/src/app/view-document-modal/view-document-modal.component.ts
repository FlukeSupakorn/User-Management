import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocumentData } from '../documents/documents.component';

@Component({
  selector: 'app-view-document-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './view-document-modal.component.html',
  styleUrl: './view-document-modal.component.css'
})
export class ViewDocumentModalComponent {
  @Input() documentData: DocumentData | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();

  onClose(): void {
    this.closeModalEvent.emit();
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}