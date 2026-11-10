import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Limite di BCrypt usato dal backend (`@MaxUtf8Bytes(72)`) per le password. */
export const PASSWORD_MAX_BYTES = 72;

const encoder = new TextEncoder();

/** Equivalente di `@NotBlank`: almeno un carattere diverso da spazio. Il vuoto resta a `required`. */
export const notBlank: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: unknown = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim().length === 0 ? { blank: true } : null;
};

/** Equivalente di `@MaxUtf8Bytes`: conta i byte UTF-8, non i caratteri. */
export function maxUtf8Bytes(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;
    if (typeof value !== 'string') return null;
    const actual = encoder.encode(value).length;
    return actual > max ? { maxUtf8Bytes: { max, actual } } : null;
  };
}

/** Data ISO locale di oggi (aaaa-mm-gg). */
export function todayIso(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
