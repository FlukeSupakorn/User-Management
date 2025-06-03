import { Component, OnInit } from '@angular/core';
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
import { AddUserModalComponent, UserFormData } from '../add-user-modal/add-user-modal.component';

export interface UserData {
  name: string;
  email: string;
  createDate: string;
  role: string;
  action: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleId?: string;
  username?: string;
  password?: string;
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
  editingUser: UserData | null = null;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;
    // Search and sort properties
  searchTerm = '';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentSort = 'name';
    // Data properties
  allUsers: UserData[] = [
    {
      name: 'David Wagner',
      email: 'activevideo@domine.com',
      createDate: '24 Oct, 2015',
      role: 'Super Admin',
      action: 'Lorem ipsum',
      firstName: 'David',
      lastName: 'Wagner',
      phone: '+1-555-0123',
      roleId: 'super-admin',
      username: 'dwagner',
      password: 'password123'
    },
    {
      name: 'Iva Hogan',
      email: 'active.warren@email.net',
      createDate: '24 Oct, 2015',
      role: 'Admin',
      action: 'Lorem ipsum',
      firstName: 'Iva',
      lastName: 'Hogan',
      phone: '+1-555-0124',
      roleId: 'admin',
      username: 'ihogan',
      password: 'password123'
    },
    {
      name: 'Devin Harrison',
      email: 'activevideo@domain.com',
      createDate: '18 Dec, 2015',
      role: 'HR Admin',
      action: 'Lorem ipsum',
      firstName: 'Devin',
      lastName: 'Harrison',
      phone: '+1-555-0125',
      roleId: 'hr-admin',
      username: 'dharrison',
      password: 'password123'
    },
    {
      name: 'Lena Page',
      email: 'activevideo@domain.net',
      createDate: '8 Oct, 2016',
      role: 'Employee',
      action: 'Lorem ipsum'
    },
    {
      name: 'Evie Barton',
      email: 'active.evie1977@email.com',
      createDate: '15 Jun, 2017',
      role: 'Super Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Victoria Perez',
      email: 'vperez@email.com',
      createDate: '14 Jan, 2019',
      role: 'HR Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Cara Medina',
      email: 'caramedina@email.com',
      createDate: '21 July, 2020',
      role: 'Employee',
      action: 'Lorem ipsum'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      createDate: '12 Mar, 2021',
      role: 'Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@domain.com',
      createDate: '8 Sep, 2021',
      role: 'Employee',
      action: 'Lorem ipsum'
    },
    {
      name: 'Emma Davis',
      email: 'emma.davis@email.net',
      createDate: '15 Nov, 2021',
      role: 'HR Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@domain.org',
      createDate: '3 Feb, 2022',
      role: 'Super Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      createDate: '22 Jun, 2022',
      role: 'Employee',
      action: 'Lorem ipsum'
    },
    {
      name: 'Robert Taylor',
      email: 'robert.taylor@domain.net',
      createDate: '17 Oct, 2022',
      role: 'Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Jennifer Brown',
      email: 'jennifer.brown@email.org',
      createDate: '9 Jan, 2023',
      role: 'HR Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Daniel Martinez',
      email: 'daniel.martinez@domain.com',
      createDate: '26 Apr, 2023',
      role: 'Employee',
      action: 'Lorem ipsum'
    }
  ];
  
  filteredUsers: UserData[] = [];
  dataSource: UserData[] = [];

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.filteredUsers = [...this.allUsers];
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }

  // Search functionality
  applyFilter() {
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
    
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page
    this.updateDisplayedData();
  }
  // Sort functionality
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

  // Pagination functionality
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
    this.currentPage = 1; // Reset to first page
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.dataSource = this.filteredUsers.slice(startIndex, endIndex);
  }

  // Utility methods
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
  }

  openEditUserModal(user: UserData) {
    // Convert display data to form data
    const names = user.name.split(' ');
    this.editingUser = {
      ...user,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      phone: user.phone || '',
      roleId: this.getRoleId(user.role),
      username: user.username || user.email.split('@')[0],
      password: '' // Don't populate password for security
    };
    this.showEditUserModal = true;
  }

  closeEditUserModal() {
    this.showEditUserModal = false;
    this.editingUser = null;
  }

  getRoleId(roleName: string): string {
    const roleMap: { [key: string]: string } = {
      'Super Admin': 'super-admin',
      'Admin': 'admin',
      'HR Admin': 'hr-admin',
      'Employee': 'employee'
    };
    return roleMap[roleName] || 'employee';
  }

  getRoleName(roleId: string): string {
    const roleMap: { [key: string]: string } = {
      'super-admin': 'Super Admin',
      'admin': 'Admin',
      'hr-admin': 'HR Admin',
      'employee': 'Employee'
    };
    return roleMap[roleId] || 'Employee';
  }

  onSaveUser(userData: any) {
    if (this.showEditUserModal && this.editingUser) {
      // Update existing user
      const userIndex = this.allUsers.findIndex(u => u.email === this.editingUser!.email);
      if (userIndex !== -1) {
        this.allUsers[userIndex] = {
          ...this.allUsers[userIndex],
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: this.getRoleName(userData.roleId),
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          roleId: userData.roleId,
          username: userData.username
        };
        this.applyFilter(); // Refresh the display
      }
      this.closeEditUserModal();
    } else {
      // Add new user
      const newUser: UserData = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        createDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        role: this.getRoleName(userData.roleId),
        action: 'Lorem ipsum',
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        roleId: userData.roleId,
        username: userData.username,
        password: userData.password
      };
      this.allUsers.push(newUser);
      this.applyFilter(); // Refresh the display
      this.closeAddUserModal();
    }
  }

  onDeleteUser() {
    if (this.editingUser) {
      const index = this.allUsers.findIndex(u => u.email === this.editingUser!.email);
      if (index !== -1) {
        this.allUsers.splice(index, 1);
        this.applyFilter(); // Refresh the display
      }
      this.closeEditUserModal();
    }
  }
  editUser(user: UserData) {
    this.openEditUserModal(user);
  }
  deleteUser(user: UserData) {
    this.openEditUserModal(user);
  }
}
