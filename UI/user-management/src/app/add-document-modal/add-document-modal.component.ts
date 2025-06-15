import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocumentService, CreateDocumentDto } from '../services/document.service';

@Component({
  selector: 'app-add-document-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-document-modal.component.html',
  styleUrl: './add-document-modal.component.css'
})
export class AddDocumentModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() editDocumentData: any = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveDocumentEvent = new EventEmitter<CreateDocumentDto>();

  documentForm!: FormGroup;
  showValidationErrors = false;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2100, 11, 31);

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEditMode && this.editDocumentData) {
      this.populateForm();
    }
  }

  initializeForm(): void {
    this.documentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      date: [new Date(), Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  populateForm(): void {
    if (this.editDocumentData) {
      this.documentForm.patchValue({
        title: this.editDocumentData.title,
        date: new Date(this.editDocumentData.date),
        description: this.editDocumentData.description || ''
      });
    }
  }

  onSave(): void {
    if (this.documentForm.valid) {
      const formData = this.documentForm.value;
      const documentData: CreateDocumentDto = {
        title: formData.title.trim(),
        date: formData.date,
        description: formData.description?.trim() || ''
      };
      this.saveDocumentEvent.emit(documentData);
    } else {
      this.showValidationErrors = true;
      this.markFormGroupTouched(this.documentForm);
    }
  }

  onCancel(): void {
    this.closeModalEvent.emit();
  }


  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.documentForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be less than ${maxLength} characters`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      date: 'Date',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }
}