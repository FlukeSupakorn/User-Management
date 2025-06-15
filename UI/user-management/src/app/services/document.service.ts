import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentDto {
  documentId?: number;
  title: string;
  description?: string;
  date: Date;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  date: Date;
}

export interface UpdateDocumentDto {
  title: string;
  description?: string;
  date: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'https://localhost:7134/api/documents';

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<ApiResponse<DocumentDto[]>> {
    return this.http.get<ApiResponse<DocumentDto[]>>(this.apiUrl);
  }

  getDocument(id: number): Observable<ApiResponse<DocumentDto>> {
    return this.http.get<ApiResponse<DocumentDto>>(`${this.apiUrl}/${id}`);
  }

  createDocument(document: CreateDocumentDto): Observable<ApiResponse<DocumentDto>> {
    return this.http.post<ApiResponse<DocumentDto>>(this.apiUrl, document);
  }

  updateDocument(id: number, document: UpdateDocumentDto): Observable<ApiResponse<DocumentDto>> {
    return this.http.put<ApiResponse<DocumentDto>>(`${this.apiUrl}/${id}`, document);
  }

  deleteDocument(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}