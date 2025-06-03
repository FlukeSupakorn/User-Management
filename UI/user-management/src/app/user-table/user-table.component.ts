import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { AddUserModalComponent} from '../add-user-modal/add-user-modal.component';
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
    MatPaginatorModule,
    MatMenuModule,
    FormsModule,
    AddUserModalComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'userRole', 'createDate', 'role', 'action'];
  showAddUserModal = false;
  showEditUserModal = false;
  editingUser: UserFormData | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;
  searchTerm = '';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentSort = 'name';
  allUsers: UserData[] = [];
  filteredUsers: UserData[] = [];
  dataSource: UserData[] = [];

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchUsersFromApi();
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
        console.log('Filter applied, dataSource length:', this.dataSource.length);
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
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }
  applyFilter() {
    console.log('applyFilter called, searchTerm:', this.searchTerm);
    console.log('allUsers length:', this.allUsers.length);
    
    if (!this.searchTerm.trim()) {
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
    
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedData();
    
    console.log('After updateDisplayedData, dataSource length:', this.dataSource.length);
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
    this.updateDisplayedData();
  }

  onSortChange(column: string) {
    this.currentSort = column;
    this.sortData(column);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  changeItemsPerPage(newSize: number) {
    this.itemsPerPage = newSize;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.dataSource = this.filteredUsers.slice(startIndex, endIndex);
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
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }
  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
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
  }  deleteUser(user: UserData) {
    if (!user.userId) {
      console.error('User ID is missing');
      return;
    }    this.userService.deleteUser(user.userId).subscribe({
      next: (response) => {
        console.log('User deleted successfully');
        // Refetch all users from API to ensure consistency
        this.fetchUsersFromApi();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }
}
