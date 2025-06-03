import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', active: false },
    { icon: 'people', label: 'Users', route: '/users', active: false },
    { icon: 'description', label: 'Documents', route: '/documents', active: false },
    { icon: 'photo_library', label: 'Photos', route: '/photos', active: false },
    { icon: 'account_tree', label: 'Hierarchy', route: '/hierarchy', active: false },
    { icon: 'message', label: 'Message', route: '/message', active: false },
    { icon: 'help', label: 'Help', route: '/help', active: false },
    { icon: 'settings', label: 'Setting', route: '/settings', active: false }
  ];

  constructor(private router: Router) {}
  ngOnInit() {
    this.updateActiveItem(this.router.url);
  }
  setActiveItem(item: MenuItem) {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
  private updateActiveItem(url: string) {
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    this.menuItems.forEach(menuItem => {
      menuItem.active = menuItem.route === cleanUrl;
    });
  }
}
