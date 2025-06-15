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
import { UserService, UserFormData, UserDataTableRequest, UserDataTableResponse, ApiResponse } from '../services/user.service';

export interface UserPermission {
  permissionId: string;
  isReadable: boolean;
  isWritable: boolean;
  isDeletable: boolean;
}

export interface UserData {
  userId?: string;
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
  sortBy = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentSort = 'firstName';
  allUsers: UserData[] = [];
  filteredUsers: UserData[] = [];
  dataSource = new MatTableDataSource<UserData>([]);
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 15, 25];

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchUsersFromApi();
  }

  ngAfterViewInit() {
    // Configure paginator
    if (this.paginator) {
      this.paginator.pageSizeOptions = this.pageSizeOptions;
      this.paginator.pageSize = this.pageSize;
      
      // Listen to paginator events
      this.paginator.page.subscribe((event) => {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.fetchUsersFromApi();
      });
    }
  }  fetchUsersFromApi() {
    console.log('Fetching users from API with pagination...');
    
    const request: UserDataTableRequest = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    console.log('Request parameters:', request);

    this.userService.getUsersDataTable(request).subscribe({
      next: (response: ApiResponse<UserDataTableResponse>) => {
        console.log('API response:', response);
        if (response.success && response.data) {
          const data = response.data;
          
          // Map API data to component format
          this.allUsers = data.data.map((u: any) => ({
            userId: u.userId,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            createDate: u.createdDate ? new Date(u.createdDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric'
            }) : '',
            role: u.role || 'Employee',
            action: 'Lorem ipsum',
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
            roleId: u.roleId,
            username: u.username
          }));

          // Update pagination info
          this.totalRecords = data.totalRecords;
          this.totalPages = data.totalPages;
          this.currentPage = data.pageNumber;
          this.pageSize = data.pageSize;

          // Update paginator
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
            this.paginator.pageIndex = this.currentPage - 1;
            this.paginator.pageSize = this.pageSize;
          }

          // Set data source (no more client-side filtering needed)
          this.dataSource.data = [...this.allUsers];
          
          console.log(`Loaded ${this.allUsers.length} users for page ${this.currentPage}/${this.totalPages}`);
          console.log(`Total records: ${this.totalRecords}`);
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.allUsers = [];
        this.dataSource.data = [];
      }
    });
  }
  applyFilter() {
    console.log('applyFilter called, searchTerm:', this.searchTerm);
    
    // Reset to page 1 when searching
    this.currentPage = 1;
    
    // Fetch data from server with new search term
    this.fetchUsersFromApi();
  }

  sortData(column: string) {
    // Map frontend column names to backend field names
    const columnMap: { [key: string]: string } = {
      'name': 'firstName',
      'email': 'email',
      'createDate': 'createdDate',
      'role': 'role'
    };

    if (this.sortBy === (columnMap[column] || column)) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = columnMap[column] || column;
      this.sortDirection = 'asc';
    }

    // Reset to page 1 when sorting
    this.currentPage = 1;
    
    // Fetch data from server with new sort parameters
    this.fetchUsersFromApi();
  }

  onSortChange(column: string) {
    this.currentSort = column;
    this.sortData(column);
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
    // Map frontend column names to backend field names for comparison
    const columnMap: { [key: string]: string } = {
      'name': 'firstName',
      'email': 'email',
      'createDate': 'createdDate',
      'role': 'role'
    };
    
    const mappedColumn = columnMap[column] || column;
    
    if (this.sortBy !== mappedColumn) {
      return 'unfold_more';
    }
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
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
    
    // The modal handles the API call directly, just refresh the table and close modals
    this.fetchUsersFromApi();
    
    if (this.showEditUserModal) {
      this.closeEditUserModal();
    } else {
      this.closeAddUserModal();
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
    this.userService.deleteUser(this.deletingUser.userId.toString()).subscribe({
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
