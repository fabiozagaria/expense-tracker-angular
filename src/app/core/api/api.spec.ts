import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { TimeoutError } from 'rxjs';
import { apiErrorName, commonAuthErrorMessage, retryAfterSeconds } from './api-error';
import { categoryLabel } from './categories';
import { maxUtf8Bytes, notBlank } from './validators';

function httpError(status: number, body: unknown = null, headers?: Record<string, string>) {
  return new HttpErrorResponse({ status, error: body, headers: new HttpHeaders(headers) });
}

describe('API contract helpers', () => {
  it('reads errorName only from an APIError body', () => {
    expect(apiErrorName(httpError(409, { errorName: 'EMAIL_ALREADY_EXISTS' }))).toBe('EMAIL_ALREADY_EXISTS');
    expect(apiErrorName(httpError(403, '<html>Forbidden</html>'))).toBeNull();
    expect(apiErrorName(new Error('x'))).toBeNull();
  });

  it('turns 429 Retry-After into a readable wait', () => {
    const limited = httpError(429, { errorName: 'RATE_LIMITED' }, { 'Retry-After': '42' });
    expect(retryAfterSeconds(limited)).toBe(42);
    expect(commonAuthErrorMessage(limited)).toBe('Troppi tentativi. Riprova tra 42 secondi.');
    expect(commonAuthErrorMessage(httpError(429, null, { 'Retry-After': '3600' })))
      .toBe('Troppi tentativi. Riprova tra 60 minuti.');
    expect(commonAuthErrorMessage(httpError(429))).toBe('Troppi tentativi. Attendi qualche minuto e riprova.');
  });

  it('describes network, unavailable and timeout errors but leaves domain errors to the page', () => {
    expect(commonAuthErrorMessage(httpError(0))).toContain('non raggiungibile');
    expect(commonAuthErrorMessage(httpError(503))).toContain('non disponibile');
    expect(commonAuthErrorMessage(new TimeoutError())).toContain('in tempo');
    expect(commonAuthErrorMessage(httpError(503, { errorName: 'EMAIL_DELIVERY_FAILED' }))).toBeNull();
    expect(commonAuthErrorMessage(httpError(400, { errorName: 'INVALID_PASSWORD_RESET_TOKEN' }))).toBeNull();
  });

  it('mirrors @NotBlank and @MaxUtf8Bytes(72)', () => {
    expect(notBlank(new FormControl('   '))).toEqual({ blank: true });
    expect(notBlank(new FormControl(''))).toBeNull();
    expect(notBlank(new FormControl(' a '))).toBeNull();
    const max = maxUtf8Bytes(72);
    expect(max(new FormControl('a'.repeat(72)))).toBeNull();
    expect(max(new FormControl('a'.repeat(73)))).toEqual({ maxUtf8Bytes: { max: 72, actual: 73 } });
    // 37 caratteri "è" = 74 byte: il server li rifiuta anche se sono meno di 72 caratteri.
    expect(max(new FormControl('è'.repeat(37)))).not.toBeNull();
  });

  it('labels every backend category', () => {
    expect(categoryLabel('groceries')).toBe('Alimentari');
    expect(categoryLabel('salary')).toBe('Stipendio');
    expect(categoryLabel('unknown')).toBe('unknown');
  });
});
