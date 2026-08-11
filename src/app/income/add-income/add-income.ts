import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncomeCategory } from '../income';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-add-income',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-income.html',
  styleUrl: './add-income.css',
})
export class AddIncome {
  protected readonly IncomeCategory = IncomeCategory;

  protected incomeForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    category: new FormControl<IncomeCategory | ''>('', [
      Validators.required,
    ]),
    description: new FormControl<string>('', [
      Validators.maxLength(100),
    ]),
    date: new FormControl<string>('', [
      Validators.required,
    ]),
  });
}
