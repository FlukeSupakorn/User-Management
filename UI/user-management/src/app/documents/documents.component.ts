import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarComponent } from '../sidebar/sidebar.component';

export interface DocumentData {
  title: string;
  date: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    SidebarComponent
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  isSidenavOpen = true;

  documents: DocumentData[] = [
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    },
    {
      title: 'Lorem ipsum',
      date: 'April 5, 2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      icon: 'description'
    }
  ];

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
