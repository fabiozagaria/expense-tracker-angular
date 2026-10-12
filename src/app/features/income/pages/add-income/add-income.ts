import { formatDate } from '@angular/common';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { IncomeCategory } from '../../models/income.model';
import { IncomeService } from '../../services/income.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RevealDirective } from '../../../../core/ui/reveal.directive';

@Component({
  selector: 'app-add-income',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, CardModule, DatePickerModule, InputNumberModule, InputTextModule, MessageModule, SelectModule, TextareaModule, RevealDirective],
  templateUrl: './add-income.html',
  styleUrl: './add-income.css',
})
export class AddIncome {
  private readonly incomeService = inject(IncomeService);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly categories: { label: string; value: IncomeCategory }[] = [
    { label: 'Stipendio', value: IncomeCategory.Salary },
    { label: 'Lavoro autonomo', value: IncomeCategory.Freelance },
    { label: 'Bonus', value: IncomeCategory.Bonus },
    { label: 'Rimborso', value: IncomeCategory.Refund },
    { label: 'Investimenti', value: IncomeCategory.Investment },
    { label: 'Regalo', value: IncomeCategory.Gift },
    { label: 'Affitto', value: IncomeCategory.Rental },
    { label: 'Altro', value: IncomeCategory.Other },
  ];
  protected readonly saved = signal(false);
  protected readonly saveError = signal('');
  protected readonly saving = signal(false);
  protected readonly maxDate = new Date();

  protected readonly incomeForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)] }),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    category: new FormControl<IncomeCategory | ''>('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl('', { nonNullable: true, validators: Validators.maxLength(30) }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required, this.hasFutureDate] }),
  });

  protected isInvalidField(fieldName: keyof typeof this.incomeForm.controls): boolean {
    const control = this.incomeForm.controls[fieldName];
    return control.invalid && control.touched;
  }

  protected fieldAria(fieldName: keyof typeof this.incomeForm.controls) {
    const invalid = this.isInvalidField(fieldName);
    return {
      'aria-invalid': invalid,
      'aria-describedby': invalid ? `income-${fieldName}-error` : undefined,
    };
  }

  protected hasFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return value > formatDate(new Date(), 'yyyy-MM-dd', 'en-US') ? { futureDate: true } : null;
  }

  protected onSubmit(): void {
    if (this.saving()) return;

    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();
      const fieldName = (Object.keys(this.incomeForm.controls) as (keyof typeof this.incomeForm.controls)[])
        .find(name => this.incomeForm.controls[name].invalid);
      this.element.nativeElement.querySelector<HTMLElement>(`#income-${fieldName}`)?.focus();
      return;
    }

    const value = this.incomeForm.getRawValue();
    if (!value.title || value.amount === null || !value.category || !value.date) return;

    this.saving.set(true);
    this.saveError.set('');
    this.incomeService.addIncome({
      title: value.title,
      amount: value.amount,
      category: value.category,
      description: value.description ?? '',
      date: value.date,
    }).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.saved.set(true);
        this.incomeForm.reset({ title: '', amount: null, category: '', description: '', date: '' });
        setTimeout(() => this.saved.set(false), 2000);
      },
      error: () => this.saveError.set("Impossibile salvare l'entrata. Riprova."),
    });
  }
}
