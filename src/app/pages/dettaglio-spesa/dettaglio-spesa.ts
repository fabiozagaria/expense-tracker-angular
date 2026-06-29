import { Component, OnInit, signal } from '@angular/core';
import { SpesaService } from '../../services/spesa-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Expense } from '../../type/spesa';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-dettaglio-spesa',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './dettaglio-spesa.html',
  styleUrl: './dettaglio-spesa.css',
})
export class DettaglioSpesa implements OnInit {
  spesa = signal<Expense | undefined>(undefined)
  constructor(
    private spesaService: SpesaService,
    protected route: ActivatedRoute
  ) {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) {
      throw new Error("Errore: Id non trovato!")
    }
    const spesa = this.spesaService.getSpesaByID(id);
    this.spesa.set(spesa);
    
  }
}
