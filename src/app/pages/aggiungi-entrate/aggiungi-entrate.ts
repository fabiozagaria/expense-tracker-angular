import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-aggiungi-entrate',
  imports: [ReactiveFormsModule],
  templateUrl: './aggiungi-entrate.html',
  styleUrl: './aggiungi-entrate.css',
})
export class AggiungiEntrate {
  protected formEntrate = new FormGroup({
    entrata: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0.01)
    ])
  });

  protected isInvalidField(fieldName: keyof typeof this.formEntrate.controls): boolean {

  }
}
