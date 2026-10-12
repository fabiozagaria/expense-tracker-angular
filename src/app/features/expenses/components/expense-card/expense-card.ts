import { afterNextRender, Component, ElementRef, inject, Injector, input, output, signal, viewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Expense, ExpenseCategory, UpdateExpenseEvent } from '../../models/expense.model';

@Component({
  selector: 'app-expense-card',
  imports: [CurrencyPipe, DatePipe, RouterLink, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, TagModule, TextareaModule],
  templateUrl: './expense-card.html',
  styleUrl: './expense-card.css',
})
export class ExpenseCard {
  readonly expense = input.required<Expense>();
  readonly onRemove = output<number>();
  readonly onUpdate = output<UpdateExpenseEvent>();

  private readonly injector = inject(Injector);
  private readonly editTitle = viewChild<ElementRef<HTMLInputElement>>('editTitle');
  private readonly editButton = viewChild<ElementRef<HTMLButtonElement>>('editButton');
  protected readonly isEditing = signal(false);
  protected readonly editForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    description: new FormControl<string>('', [Validators.maxLength(30)]),
  });
  private readonly categoryLabels: Record<ExpenseCategory, string> = {
    groceries: 'Alimentari', car: 'Auto', gifts: 'Regali', installments: 'Rate',
    loan: 'Prestito', health: 'Salute', transport: 'Trasporti', bills: 'Bollette',
    housing: 'Casa', leisure: 'Tempo libero', other: 'Altro',
  };

  protected categoryLabel(category: ExpenseCategory): string {
    return this.categoryLabels[category] ?? category;
  }

  protected fieldInvalid(field: 'title' | 'description'): boolean {
    const control = this.editForm.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  protected startEdit(): void {
    const currentExpense = this.expense();
    this.editForm.reset({ title: currentExpense.title, description: currentExpense.description });
    this.isEditing.set(true);
    afterNextRender(() => this.editTitle()?.nativeElement.focus(), { injector: this.injector });
  }

  protected saveEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const currentExpense = this.expense();
    const formValue = this.editForm.getRawValue();
    this.onUpdate.emit({
      id: currentExpense.id,
      patch: { title: formValue.title ?? '', description: formValue.description ?? '' },
    });
    this.closeEditor();
  }

  protected cancelEdit(): void {
    this.closeEditor();
  }

  protected removeExpense(): void {
    this.onRemove.emit(this.expense().id);
  }

  private closeEditor(): void {
    this.isEditing.set(false);
    afterNextRender(() => this.editButton()?.nativeElement.focus(), { injector: this.injector });
  }
}
