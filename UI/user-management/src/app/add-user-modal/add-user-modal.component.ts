import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService, UserFormData, Role, ApiResponse } from '../services/user.service';

export interface ModulePermission {
  moduleName: string;
  read: boolean;
  write: boolean;
  delete: boolean;
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
  roles: Role[] = [];
  modulePermissions: ModulePermission[] = [
    { moduleName: 'Super Admin', read: false, write: false, delete: false },
    { moduleName: 'Admin', read: false, write: false, delete: false },
    { moduleName: 'Employee', read: false, write: false, delete: false },
    { moduleName: 'Lorem Ipsum', read: false, write: false, delete: false }
  ];
  private apiUrl = 'https://localhost:7134/api';

  constructor(private fb: FormBuilder, private userService: UserService) {}
  ngOnInit() {
    this.initializeForm();
    this.loadRoles();
    if (this.isEditMode && this.editUserData) {
      this.populateForm();
    }
  }
  // Custom validator for password confirmation
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const password = control.parent.get('password');
      const confirmPassword = control;
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  initializeForm() {
    this.userForm = this.fb.group({
      userId: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      roleId: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator()]]
    });
  }  loadRoles() {
    // Fallback roles for when API is not available
    this.roles = [
      { roleId: 1, roleName: 'Super Admin', description: 'Full access to all modules' },
      { roleId: 2, roleName: 'Admin', description: 'Administrative access' },
      { roleId: 3, roleName: 'Employee', description: 'Limited access' }
    ];

    // Try to load from API, but don't fail if it's not available
    this.userService.getRoles().subscribe({
      next: (response: ApiResponse<Role[]>) => {
        if (response.success) {
          this.roles = response.data;
        }
      },
      error: (error: any) => {
        console.log('API not available, using fallback roles');
      }
    });
  }populateForm() {
    if (this.editUserData) {
      this.userForm.patchValue({
        userId: this.editUserData.userId || '',
        firstName: this.editUserData.firstName || '',
        lastName: this.editUserData.lastName || '',
        email: this.editUserData.email || '',
        phone: this.editUserData.phone || '',
        roleId: this.editUserData.roleId || '',
        username: this.editUserData.username || '',
        password: '', // Always leave password empty for security
        confirmPassword: ''
      });
    }
  }

  updatePermission(moduleName: string, permissionType: 'read' | 'write' | 'delete', checked: boolean) {
    const permission = this.modulePermissions.find(p => p.moduleName === moduleName);
    if (permission) {
      permission[permissionType] = checked;
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }  saveUser() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const userData: UserFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        roleId: parseInt(formData.roleId) // Make sure roleId is included as a number
      };

      console.log('User data to save:', userData);
      console.log('Module permissions:', this.modulePermissions);

      // Try to call API to save user
      this.userService.createUser(userData).subscribe({
        next: (response: ApiResponse<UserFormData>) => {
          if (response.success) {
            alert('User saved successfully!');
            this.closeModal();
          } else {
            alert('Error saving user: ' + response.message);
          }
        },
        error: (error: any) => {
          console.error('Error saving user:', error);
          alert('Error saving user. Please check the console for details.');
        }
      });
    } else {
      // Show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      alert('Please fill in all required fields correctly.');
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
