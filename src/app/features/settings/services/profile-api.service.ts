import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/** Risposta di `GET /api/me`: solo username ed email dell'utente del token. */
export interface Profile {
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiBaseUrl}/api/me`);
  }
}
