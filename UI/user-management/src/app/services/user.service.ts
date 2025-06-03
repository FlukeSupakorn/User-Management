import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserFormData {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  roleId?: number;
  username?: string;
  password?: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7134/api';

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  getUsers(): Observable<ApiResponse<UserFormData[]>> {
    return this.http.get<ApiResponse<UserFormData[]>>(`${this.apiUrl}/Users`, this.getHttpOptions());
  }

  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.apiUrl}/Roles`, this.getHttpOptions());
  }

  createUser(userData: UserFormData): Observable<ApiResponse<UserFormData>> {
    return this.http.post<ApiResponse<UserFormData>>(`${this.apiUrl}/Users`, userData, this.getHttpOptions());
  }

  updateUser(userId: number, userData: UserFormData): Observable<ApiResponse<UserFormData>> {
    return this.http.put<ApiResponse<UserFormData>>(`${this.apiUrl}/Users/${userId}`, userData, this.getHttpOptions());
  }

  deleteUser(userId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Users/${userId}`, this.getHttpOptions());
  }
}