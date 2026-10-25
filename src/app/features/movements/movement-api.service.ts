import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
export interface Movement { id: number; title: string; amount: number; description: string | null; category: string; date: string; }
export interface MovementPage { content: Movement[]; number: number; size: number; totalElements: number; totalPages: number; }
export type MovementKind = 'expenses' | 'incomes';
@Injectable({ providedIn: 'root' })
export class MovementApiService {
  private readonly http = inject(HttpClient);
  private url(kind: MovementKind) { return `${environment.apiBaseUrl}/api/${kind}`; }
  search(kind: MovementKind, params: {page: number; size: number; month: string; query: string; order: string}) {
    return this.http.get<MovementPage>(`${this.url(kind)}/search`, { params });
  }
  update(kind: MovementKind, movement: Movement) {
    return this.http.put<Movement>(`${this.url(kind)}/${movement.id}`, movement);
  }
  remove(kind: MovementKind, id: number) { return this.http.delete(`${this.url(kind)}/${id}`); }
}
