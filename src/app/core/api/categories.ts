import { ExpenseCategory } from '../../features/expenses/models/expense.model';
import { IncomeCategory } from '../../features/income/models/income.model';

/** Etichette italiane degli enum `ExpenseCategory` del backend. */
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  groceries: 'Alimentari', car: 'Auto', gifts: 'Regali', installments: 'Rate',
  loan: 'Prestito', health: 'Salute', transport: 'Trasporti', bills: 'Bollette',
  housing: 'Casa', leisure: 'Tempo libero', other: 'Altro',
};

/** Etichette italiane degli enum `IncomeCategory` del backend. */
export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  salary: 'Stipendio', freelance: 'Lavoro autonomo', bonus: 'Bonus', refund: 'Rimborso',
  investment: 'Investimenti', gift: 'Regalo', rental: 'Affitto', other: 'Altro',
};

/** Etichetta di una categoria di spesa o di entrata; il valore grezzo se sconosciuto. */
export function categoryLabel(category: string): string {
  return (EXPENSE_CATEGORY_LABELS as Record<string, string>)[category]
    ?? (INCOME_CATEGORY_LABELS as Record<string, string>)[category]
    ?? category;
}
