import { Injectable, signal, WritableSignal } from '@angular/core';
import { Expense, ExpensePatch } from '../type/spesa';

@Injectable({
  providedIn: 'root',
})
export class SpesaService {
  private _allExpense: WritableSignal<Expense[]> = signal([]);
  readonly allExpense = this._allExpense.asReadonly();
  


  public addExpense(expense: Expense): void {
    this._allExpense.update(prev => [...prev, expense])
  }

  public removeExpense(id: string): void {
    this._allExpense.update(prev => prev.filter(s => s.id !== id))
  }

  public updateExpense(id: string, patch: ExpensePatch): void {
    this._allExpense.update(prev =>
      prev.map(expense => expense.id === id ? {...expense, ...patch} : expense

      )
    )

  }

  public getSpesaByID(id: string): Expense {
    const spesaTrovata = this._allExpense().find(spesa => spesa.id === id);

    if(!spesaTrovata) {
      throw new Error("Errore: Id non trovato");
    }

    return spesaTrovata;
  }
  

  

 
}
