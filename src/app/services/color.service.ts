import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Color {
  id: number;
  name: string;
  hex_value: string;
}

@Injectable({ providedIn: 'root' })
export class ColorService {
  private apiUrl = '/api/colors';

  constructor(private http: HttpClient) {}

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(this.apiUrl);
  }

  addColor(color: Omit<Color, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, color);
  }

  deleteColor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateColor(id: number, color: Omit<Color, 'id'>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, color);
  }
}
