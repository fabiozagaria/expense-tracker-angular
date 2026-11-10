import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

/** Corpo degli errori del backend (`APIError` in expense-tracker-api). */
export interface ApiError {
  errorName: string;
  details: string;
  path: string;
  timestamp: string;
  status: string;
}

/** Il codice `errorName` del backend, se la risposta lo contiene. */
export function apiErrorName(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) return null;
  const body: unknown = error.error;
  return typeof body === 'object' && body !== null && 'errorName' in body && typeof body.errorName === 'string'
    ? body.errorName
    : null;
}

/** Secondi indicati dall'header `Retry-After` di una risposta 429. */
export function retryAfterSeconds(error: unknown): number | null {
  if (!(error instanceof HttpErrorResponse) || error.status !== 429) return null;
  const seconds = Number(error.headers?.get('Retry-After'));
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : null;
}

function waitText(seconds: number): string {
  if (seconds < 60) return `${seconds} ${seconds === 1 ? 'secondo' : 'secondi'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} ${minutes === 1 ? 'minuto' : 'minuti'}`;
}

/**
 * Messaggi comuni per gli endpoint pubblici di `/auth`: limite di richieste (429),
 * server irraggiungibile (0), servizio non disponibile (503) e attesa scaduta.
 * Restituisce null per gli errori che la pagina deve interpretare da sé.
 */
export function commonAuthErrorMessage(error: unknown): string | null {
  if (error instanceof TimeoutError) return 'Il server non ha risposto in tempo. Riprova più tardi.';
  if (!(error instanceof HttpErrorResponse)) return null;
  if (error.status === 429) {
    const seconds = retryAfterSeconds(error);
    return seconds
      ? `Troppi tentativi. Riprova tra ${waitText(seconds)}.`
      : 'Troppi tentativi. Attendi qualche minuto e riprova.';
  }
  if (error.status === 0) return 'Server non raggiungibile. Controlla la connessione e riprova.';
  if (error.status === 503 && apiErrorName(error) !== 'EMAIL_DELIVERY_FAILED') {
    return 'Servizio momentaneamente non disponibile. Riprova più tardi.';
  }
  return null;
}
