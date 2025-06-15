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
import { DocumentService, DocumentDto, CreateDocumentDto } from '../services/document.service';
import { AddDocumentModalComponent } from '../add-document-modal/add-document-modal.component';
import { DeleteDocumentModalComponent } from '../delete-document-modal/delete-document-modal.component';

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
    SidebarComponent,
    AddDocumentModalComponent,
    DeleteDocumentModalComponent
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
  sortBy: string = '';
  dateFilter: string = '';
  showAddModal = false;
  showEditModal = false;
  editDocumentData: DocumentData | null = null;
  showDeleteModal = false;
  deleteDocumentData: DocumentData | null = null;

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

  openDeleteModal(document: DocumentData): void {
    this.deleteDocumentData = document;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteDocumentData = null;
  }

  confirmDeleteDocument(): void {
    if (!this.deleteDocumentData?.documentId) return;
    
    this.documentService.deleteDocument(this.deleteDocumentData.documentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadDocuments();
          this.closeDeleteModal();
        }
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  truncateText(text: string | undefined, maxLength: number = 100): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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

  isDateInRange(date: Date, filter: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const docDate = new Date(date);
    docDate.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'today':
        return docDate.getTime() === today.getTime();
      
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return docDate >= weekStart && docDate <= weekEnd;
      
      case 'month':
        return docDate.getMonth() === today.getMonth() && 
               docDate.getFullYear() === today.getFullYear();
      
      case 'year':
        return docDate.getFullYear() === today.getFullYear();
      
      default:
        return true;
    }
  }

  filterDocuments(): void {
    let filtered = [...this.documents];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(document => 
        document.title.toLowerCase().includes(searchLower) ||
        (document.description && document.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply date filter
    if (this.dateFilter) {
      filtered = filtered.filter(document => 
        this.isDateInRange(document.date, this.dateFilter)
      );
    }

    this.filteredDocuments = filtered;
    
    this.sortDocuments();
  }

  sortDocuments(): void {
    if (!this.sortBy) return;

    this.filteredDocuments.sort((a, b) => {
      if (this.sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === 'date') {
        return b.date.getTime() - a.date.getTime();
      }
      return 0;
    });
  }

  onSearchChange(): void {
    this.filterDocuments();
  }

  onSortChange(): void {
    this.sortDocuments();
  }

  onDateFilterChange(): void {
    this.filterDocuments();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  openEditModal(document: DocumentData): void {
    this.editDocumentData = document;
    this.showEditModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.editDocumentData = null;
  }

  onSaveDocument(documentData: CreateDocumentDto): void {
    this.documentService.createDocument(documentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadDocuments();
          this.closeModal();
        }
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  onUpdateDocument(documentData: CreateDocumentDto): void {
    if (!this.editDocumentData?.documentId) return;
    
    this.documentService.updateDocument(this.editDocumentData.documentId, documentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadDocuments();
          this.closeModal();
        }
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  onDeleteDocumentFromModal(): void {
    if (!this.editDocumentData?.documentId) return;
    
    this.documentService.deleteDocument(this.editDocumentData.documentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Document deleted successfully');
          this.loadDocuments();
          this.closeModal();
        } else {
          this.showError(response.message || 'Failed to delete document');
        }
      },
      error: (error) => {
        this.showError('Failed to delete document');
      }
    });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}