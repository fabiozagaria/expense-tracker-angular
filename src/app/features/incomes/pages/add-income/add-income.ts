import { formatDate } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CreateIncomeRequest, IncomeCategory } from '../../models/income.model';
import { IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-add-income',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-income.html',
})
export class AddIncome {
  private readonly incomeService = inject(IncomeService);

  protected readonly IncomeCategory = IncomeCategory;
  protected readonly saved = signal(false);
  protected readonly saveError = signal('');
  protected readonly saving = signal(false);
  protected readonly maxDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  protected readonly incomeForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    category: new FormControl<IncomeCategory | ''>('', Validators.required),
    description: new FormControl<string>('', Validators.maxLength(30)),
    date: new FormControl<string>('', [Validators.required, this.hasFutureDate]),
  });

  protected isInvalidField(fieldName: keyof typeof this.incomeForm.controls): boolean {
    const control = this.incomeForm.controls[fieldName];
    return control.invalid && control.touched;
  }

  protected hasFieldError(fieldName: keyof typeof this.incomeForm.controls, errorName: string): boolean {
    const control = this.incomeForm.controls[fieldName];
    return control.hasError(errorName) && control.touched;
  }

  protected hasFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return value > new Date().toLocaleDateString('en-CA') ? { futureDate: true } : null;
  }

  protected onSubmit(): void {
    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();
      return;
    }

    const value = this.incomeForm.getRawValue();
    if (!value.title || value.amount === null || !value.category || !value.date) return;

    const request: CreateIncomeRequest = {
      title: value.title,
      amount: value.amount,
      category: value.category,
      description: value.description ?? '',
      date: value.date,
    };

    this.saving.set(true);
    this.saveError.set('');
    this.incomeService.addIncome(request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.saved.set(true);
          this.incomeForm.reset({ title: '', amount: null, category: '', description: '', date: '' });
          setTimeout(() => this.saved.set(false), 2000);
        },
        error: () => this.saveError.set("Impossibile salvare l'entrata. Riprova."),
      });
  }
}
