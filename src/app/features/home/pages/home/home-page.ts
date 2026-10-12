import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../auth/services/auth.service';
import { RevealDirective } from '../../../../core/ui/reveal.directive';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ButtonModule, CardModule, TagModule, RevealDirective],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  protected readonly auth = inject(AuthService);
  protected title = signal('Gestore di Spese');
}
