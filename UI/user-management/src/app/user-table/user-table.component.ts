import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { AddUserModalComponent} from '../add-user-modal/add-user-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { UserService, UserFormData } from '../services/user.service';

export interface UserPermission {
  permissionId: string;
  isReadable: boolean;
  isWritable: boolean;
  isDeletable: boolean;
}

export interface UserData {
  userId?: number;
  name: string;
  email: string;
  createDate: string;
  role: string;
  action: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleId?: number;
  username?: string;
  password?: string;
  permission?: UserPermission[];
}

@Component({
  selector: 'app-user-table',
  standalone: true,  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    AddUserModalComponent,
    DeleteConfirmationModalComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['name', 'userRole', 'createDate', 'role', 'action'];
  showAddUserModal = false;
  showEditUserModal = false;
  showDeleteConfirmModal = false;
  editingUser: UserFormData | null = null;
  deletingUser: UserData | null = null;
  searchTerm = '';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentSort = 'name';
  allUsers: UserData[] = [];
  filteredUsers: UserData[] = [];
  dataSource = new MatTableDataSource<UserData>([]);

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchUsersFromApi();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }  fetchUsersFromApi() {
    console.log('Fetching users from API...');
    this.userService.getUsers().subscribe({
      next: (response) => {
        console.log('API response:', response);
        const previousUserCount = this.allUsers.length;
        this.allUsers = (response.data || []).map((u: any) => ({
          userId: u.userId,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          createDate: u.createdDate ? new Date(u.createdDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          }) : '',
          role: u.role || this.getRoleName(u.roleId) || 'Employee',
          action: 'Lorem ipsum',
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          roleId: u.roleId,
          username: u.username
        }));
        console.log('Mapped users:', this.allUsers);
        console.log(`User count changed from ${previousUserCount} to ${this.allUsers.length}`);
        
        // Find the updated user and log it
        const updatedUser = this.allUsers.find(u => u.userId === parseInt(this.editingUser?.userId || '0'));
        if (updatedUser) {
          console.log('Updated user in fetched data:', updatedUser);
        }
        
        this.applyFilter();
        console.log('Filter applied, dataSource length:', this.dataSource.data.length);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.allUsers = [];
        this.applyFilter();
      }
    });
  }
  initializeData() {
    this.filteredUsers = [...this.allUsers];
    this.updateDisplayedData();
  }
  applyFilter() {
    console.log('applyFilter called, searchTerm:', this.searchTerm);
    console.log('allUsers length:', this.allUsers.length);
    
    if (!this.searchTerm.trim()) {
      this.dataSource.filter = '';
      this.filteredUsers = [...this.allUsers];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredUsers = this.allUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
    }
    
    console.log('filteredUsers length:', this.filteredUsers.length);
    
    this.updateDisplayedData();
    
    console.log('After updateDisplayedData, dataSource length:', this.dataSource.data.length);
  }

  sortData(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.filteredUsers.sort((a: any, b: any) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      return this.sortDirection === 'desc' ? comparison * -1 : comparison;
    });
    this.updateDisplayedData();  }

  onSortChange(column: string) {
    this.currentSort = column;
    this.sortData(column);
  }

  updateDisplayedData() {
    this.dataSource.data = [...this.filteredUsers];
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'Super Admin':
        return 'role-super-admin';
      case 'Admin':
        return 'role-admin';
      case 'HR Admin':
        return 'role-hr-admin';
      case 'Employee':
        return 'role-employee';
      default:
        return '';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) {
      return 'unfold_more';
    }
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';  }
  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }  openEditUserModal(user: UserData) {
    const names = user.name.split(' ');
    this.editingUser = {
      userId: user.userId?.toString(), 
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: user.email,
      phone: user.phone || '',
      roleId: this.getRoleId(user.role),
      username: user.username || user.email.split('@')[0],
    };
    this.showEditUserModal = true;
  }

  closeEditUserModal() {
    this.showEditUserModal = false;
    this.editingUser = null;
  }
  getRoleId(roleName: string): number {
    const roleMap: { [key: string]: number } = {
      'Super Admin': 2,
      'Admin': 3,
      'Employee': 4,
      'HR Admin': 5
    };
    return roleMap[roleName] || 4;
  }
  getRoleName(roleId: number): string {
    const roleMap: { [key: number]: string } = {
      2: 'Super Admin',
      3: 'Admin', 
      4: 'Employee',
      5: 'HR Admin'
    };
    return roleMap[roleId] || 'Employee';
  }  onSaveUser(userData: any) {
    console.log('onSaveUser called with userData:', userData);
    console.log('showEditUserModal:', this.showEditUserModal);
    console.log('editingUser:', this.editingUser);
    
    if (this.showEditUserModal && this.editingUser) {
      // Edit mode - call API to update user
      if (!this.editingUser.userId) {
        console.error('User ID is missing for update');
        return;
      }      const updateData: UserFormData = {
        userId: this.editingUser.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        roleId: userData.roleId,
        username: userData.username
        // Remove password to avoid issues
      };      // Only include password if it's provided
      if (userData.password && userData.password.trim() !== '') {
        updateData.password = userData.password;
      }

      console.log('Calling updateUser API with data:', updateData);
      console.log('User ID for update:', parseInt(this.editingUser.userId));

      this.userService.updateUser(parseInt(this.editingUser.userId), updateData).subscribe({
        next: (response) => {
          console.log('Update API response:', response);
          if (response.success) {
            console.log('User updated successfully');
            // Refetch all users from API to ensure consistency with a small delay
            setTimeout(() => {
              this.fetchUsersFromApi();
            }, 100);
          } else {
            console.error('Error updating user:', response.message);
          }
          this.closeEditUserModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          // Still close the modal but show the error
          this.closeEditUserModal();
        }
      });
    } else {
      // Add mode - call API to create user
      const createData: UserFormData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        roleId: userData.roleId,
        username: userData.username,
        password: userData.password
      };        this.userService.createUser(createData).subscribe({
          next: (response) => {
            if (response.success) {
              console.log('User created successfully');
              // Refetch all users from API to ensure consistency
              this.fetchUsersFromApi();
            } else {
              console.error('Error creating user:', response.message);
            }
            this.closeAddUserModal();
          },
          error: (error) => {
            console.error('Error creating user:', error);
            // Still close the modal but show the error
            this.closeAddUserModal();
          }
        });
    }
  }

  onDeleteUser() {
    if (this.editingUser) {
      const index = this.allUsers.findIndex(u => u.email === this.editingUser!.email);
      if (index !== -1) {
        this.allUsers.splice(index, 1);
        this.applyFilter();
      }
      this.closeEditUserModal();
    }
  }
  editUser(user: UserData) {
    this.openEditUserModal(user);
  }
  deleteUser(user: UserData) {
    console.log('Delete button pressed for user:', user.name, 'ID:', user.userId);
    this.deletingUser = user;
    this.showDeleteConfirmModal = true;
  }

  confirmDelete() {
    if (!this.deletingUser?.userId) {
      return;
    }
    this.userService.deleteUser(this.deletingUser.userId).subscribe({
      next: () => {
        this.fetchUsersFromApi();
        this.cancelDelete();
      },
      error: () => {
        this.cancelDelete();
      }
    });
  }

  cancelDelete() {
    this.showDeleteConfirmModal = false;
    this.deletingUser = null;
  }

  getDeletingUserName(): string {
    const name = this.deletingUser ? this.deletingUser.name : '';
    console.log('getDeletingUserName called, returning:', name);
    return name;
  }
}
