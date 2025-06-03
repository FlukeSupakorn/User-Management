import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface UserFormData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  roleId?: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css'
})
export class AddUserModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() editUserData: UserFormData | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveUserEvent = new EventEmitter<UserFormData>();
  @Output() deleteUserEvent = new EventEmitter<void>();

  userForm!: FormGroup;
  showDeleteConfirm = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    if (this.isEditMode && this.editUserData) {
      this.populateForm();
    }
  }

  initializeForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      roleId: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  populateForm() {
    if (this.editUserData) {
      this.userForm.patchValue({
        firstName: this.editUserData.firstName || '',
        lastName: this.editUserData.lastName || '',
        email: this.editUserData.email || '',
        phone: this.editUserData.phone || '',
        roleId: this.editUserData.roleId || '',
        username: this.editUserData.username || '',
        password: '' // Always leave password empty for security
      });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  saveUser() {
    if (this.userForm.valid) {
      this.saveUserEvent.emit(this.userForm.value);
    }
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  deleteUser() {
    this.deleteUserEvent.emit();
    this.showDeleteConfirm = false;
  }
}
