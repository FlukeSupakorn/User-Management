import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DocumentService, DocumentDto } from '../services/document.service';

export interface DocumentData {
  documentId?: number;
  title: string;
  date: Date;
  description?: string;
  icon: string;
  createdDate?: Date;
  updatedDate?: Date;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SidebarComponent
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  isSidenavOpen = true;
  isLoading = false;
  error: string | null = null;
  documents: DocumentData[] = [];
  filteredDocuments: DocumentData[] = [];
  searchTerm: string = '';

  constructor(
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.error = null;
    
    this.documentService.getDocuments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documents = response.data.map(doc => ({
            ...doc,
            date: new Date(doc.date),
            icon: 'description'
          }));
          this.filteredDocuments = [...this.documents];
        } else {
          this.error = response.message || 'Failed to load documents';
          this.showError(this.error);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load documents';
        this.showError(this.error);
        this.isLoading = false;
      }
    });
  }

  deleteDocument(documentId: number | undefined): void {
    if (!documentId) return;
    
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(documentId).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Document deleted successfully');
            this.loadDocuments();
          } else {
            this.showError(response.message || 'Failed to delete document');
          }
        },
        error: (error) => {
          this.showError('Failed to delete document');
        }
      });
    }
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  filterDocuments(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDocuments = [...this.documents];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredDocuments = this.documents.filter(document => 
      document.title.toLowerCase().includes(searchLower) ||
      (document.description && document.description.toLowerCase().includes(searchLower))
    );
  }

  onSearchChange(): void {
    this.filterDocuments();
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}