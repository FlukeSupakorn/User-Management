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
import { UserService, UserFormData, UserPermission, Role, ApiResponse, ModulePermissionDto } from '../services/user.service';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import ShortUniqueId from 'short-unique-id';

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
    MatIconModule,
    DeleteConfirmationModalComponent
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
  showValidationErrors = false;
  roles: Role[] = [];
  modulePermissions: ModulePermission[] = [
    { moduleName: 'Users', read: false, write: false, delete: false },
    { moduleName: 'Reports', read: false, write: false, delete: false },
    { moduleName: 'Settings', read: false, write: false, delete: false },
    { moduleName: 'Dashboard', read: false, write: false, delete: false },
    { moduleName: 'Inventory', read: false, write: false, delete: false },
    { moduleName: 'Orders', read: false, write: false, delete: false },
    { moduleName: 'Analytics', read: false, write: false, delete: false }
  ];
  private apiUrl = 'https://localhost:7134/api';

  constructor(private fb: FormBuilder, private userService: UserService) {}
  ngOnInit() {
    this.initializeForm();
    this.loadRoles();
    if (this.isEditMode && this.editUserData) {
      this.populateForm();
    } else {
      // Auto-generate userID for new users
      this.generateUserId();
    }
  }

  generateUserId() {
    // Generate a unique alphanumeric user ID to avoid collisions
    const uid = new ShortUniqueId({ 
      length: 10,
      dictionary: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    });
    
    const generatedId = uid.rnd();
    
    this.userForm.patchValue({ userId: generatedId });
  }
  
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
    if (this.isEditMode) {
      // No password fields for edit mode
      this.userForm = this.fb.group({
        userId: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        roleId: ['', [Validators.required]],
        username: ['', [Validators.required]]
      });
    } else {
      // Include password fields for add mode
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
    }
  }  loadRoles() {
    
    this.roles = [
      { roleId: 1, roleName: 'Super Admin', description: 'Full access to all modules' },
      { roleId: 2, roleName: 'Admin', description: 'Administrative access' },
      { roleId: 3, roleName: 'Employee', description: 'Limited access' }
    ];

    
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
  }  populateForm() {
    if (this.editUserData) {
      const formValue: any = {
        userId: this.editUserData.userId || '',
        firstName: this.editUserData.firstName || '',
        lastName: this.editUserData.lastName || '',
        email: this.editUserData.email || '',
        phone: this.editUserData.phone || '',
        roleId: this.editUserData.roleId || '',
        username: this.editUserData.username || ''
      };

      // Only add password fields if not in edit mode
      if (!this.isEditMode) {
        formValue.password = '';
        formValue.confirmPassword = '';
      }

      this.userForm.patchValue(formValue);

      // Load permissions from API instead of using passed data
      if (this.editUserData.userId) {
        this.loadUserPermissions(this.editUserData.userId);
      }
    }
  }

  loadUserPermissions(userId: string) {
    this.userService.getUserModulePermissions(userId).subscribe({
      next: (response: ApiResponse<ModulePermissionDto[]>) => {
        if (response.success) {
          // Reset all permissions to false first
          this.modulePermissions.forEach(mp => {
            mp.read = false;
            mp.write = false;
            mp.delete = false;
          });

          // Set permissions from database
          response.data.forEach((perm: ModulePermissionDto) => {
            const modulePermission = this.modulePermissions.find(mp => mp.moduleName === perm.moduleName);
            if (modulePermission) {
              modulePermission.read = perm.canRead;
              modulePermission.write = perm.canWrite;
              modulePermission.delete = perm.canDelete;
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading user permissions:', error);
        // Keep default permissions (all false) if API call fails
      }
    });
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
    if (this.userForm.valid || this.isEditMode) {
      const formData = this.userForm.value;
      const userData: UserFormData = {
        userId: formData.userId.toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        roleId: formData.roleId.toString(), // Send as string to match API expectation
        permissions: this.modulePermissions.map(perm => ({
          moduleName: perm.moduleName,
          isReadable: perm.read,
          isWritable: perm.write,
          isDeletable: perm.delete
        }))
      };

      // Only include password for new users
      if (!this.isEditMode) {
        userData.password = formData.password;
      }

      console.log('User data to save:', userData);
      console.log('Module permissions:', this.modulePermissions);

      if (this.isEditMode) {
        // Call update API directly like add mode, sending permissions to backend
        if (this.editUserData && this.editUserData.userId) {
          this.userService.updateUser(this.editUserData.userId, userData).subscribe({
            next: (response: ApiResponse<UserFormData>) => {
              if (response.success) {
                // Emit to parent to trigger refresh
                this.saveUserEvent.emit(userData);
                this.closeModal();
              } else {
                alert('Error updating user: ' + response.message);
              }
            },
            error: (error: any) => {
              console.error('Error updating user:', error);
              console.error('Error details:', error.error);
              if (error.error && error.error.errors) {
                console.error('Validation errors:', error.error.errors);
              }
              alert('Error updating user. Please check the console for details.');
            }
          });
        }
      } else {
        
        this.userService.createUser(userData).subscribe({
          next: (response: ApiResponse<UserFormData>) => {
            if (response.success) {
              // Emit the saved user data to parent to trigger refresh
              this.saveUserEvent.emit(userData);
              this.closeModal();
            } else {
              alert('Error saving user: ' + response.message);
            }
          },
          error: (error: any) => {
            console.error('Error saving user:', error);
            console.error('Error details:', error.error);
            if (error.error && error.error.errors) {
              console.error('Validation errors:', error.error.errors);
            }
            alert('Error saving user. Please check the console for details.');
          }
        });
      }
    } else {
      // Enable validation display and mark all fields as touched
      this.showValidationErrors = true;
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      // Visual feedback only - no alert popup
    }
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  deleteUser() {
    if (this.editUserData && this.editUserData.userId) {
      this.userService.deleteUser(this.editUserData.userId).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.success) {
            alert('User deleted successfully!');
            this.closeModal();
            // Emit event to parent to refresh the user list
            this.deleteUserEvent.emit();
          } else {
            alert('Error deleting user: ' + response.message);
          }
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Check the console for details.');
        }
      });
    }

    this.showDeleteConfirm = false;
  }

  getUserDisplayName(): string {
    if (this.editUserData) {
      return `${this.editUserData.firstName} ${this.editUserData.lastName}`;
    }
    const formData = this.userForm.value;
    return `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'this user';
  }

  shouldShowError(fieldName: string): boolean {
    if (!this.showValidationErrors) return false;
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}
