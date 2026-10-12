import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RevealDirective } from '../../../../core/ui/reveal.directive';

@Component({
  selector: 'app-add-transaction',
  imports: [RouterLink, ButtonModule, CardModule, TagModule, RevealDirective],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.css',
})
export class AddTransaction {}
