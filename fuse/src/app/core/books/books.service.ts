import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id: string;
  title: string;
  author: string | null;
  categoryId: string | null;
  fileUrl: string | null;
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CreateBook {
  title: string;
  author?: string | null;
  categoryId?: string | null;
  fileUrl?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/v1/books';

  getBooks(page = 1, limit = 10): Observable<BooksResponse> {
    return this.http.get<BooksResponse>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: CreateBook): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }
}