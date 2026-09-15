import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  private route = inject(ActivatedRoute);
  private token = this.getToken();

  private getToken(): string | null {
   const tokenVerification: string | null = this.route.snapshot.queryParamMap.get('token');
   return tokenVerification;
  }
}
