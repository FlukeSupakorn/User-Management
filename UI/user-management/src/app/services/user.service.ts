import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserPermission {
  permissionId?: string;
  moduleName?: string;
  isReadable: boolean;
  isWritable: boolean;
  isDeletable: boolean;
}

export interface ModulePermissionDto {
  permissionId: number;
  moduleName: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

export interface UserDataTableRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface UserDataTableResponse {
  data: UserFormData[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface UserFormData {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  roleId?: number | string; // Allow both number and string
  username?: string;
  password?: string;
  permissions?: UserPermission[];
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

  updateUser(userId: string, userData: UserFormData): Observable<ApiResponse<UserFormData>> {
    return this.http.put<ApiResponse<UserFormData>>(`${this.apiUrl}/Users/${userId}`, userData, this.getHttpOptions());
  }

  deleteUser(userId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Users/${userId}`, this.getHttpOptions());
  }

  getUserModulePermissions(userId: string): Observable<ApiResponse<ModulePermissionDto[]>> {
    return this.http.get<ApiResponse<ModulePermissionDto[]>>(`${this.apiUrl}/ModulePermissions/user/${userId}`, this.getHttpOptions());
  }

  getUsersDataTable(request: UserDataTableRequest): Observable<ApiResponse<UserDataTableResponse>> {
    return this.http.post<ApiResponse<UserDataTableResponse>>(`${this.apiUrl}/Users/DataTable`, request, this.getHttpOptions());
  }
}