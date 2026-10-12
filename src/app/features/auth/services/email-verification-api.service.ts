import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  public verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, null, {
      params: { token },
    });
  }
}

