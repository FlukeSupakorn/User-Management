import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

export interface UserData {
  name: string;
  email: string;
  createDate: string;
  role: string;
  action: string;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  displayedColumns: string[] = ['name', 'createDate', 'role', 'action'];
  
  dataSource: UserData[] = [
    {
      name: 'David Wagner',
      email: 'activevideo@domine.com',
      createDate: '24 Oct, 2015',
      role: 'Super Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Iva Hogan',
      email: 'active.warren@email.net',
      createDate: '24 Oct, 2015',
      role: 'Admin',
      action: 'Lorem ipsum'
    },
    {
      name: 'Devin Harrison',
      email: 'activevideo@domain.com',
      createDate: '18 Dec, 2015',
      role: 'HR Admin',
      action: 'Lorem ipsum'
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
    }
  ];

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
}
