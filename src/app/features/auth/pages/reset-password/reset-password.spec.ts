import { vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ResetPassword } from './reset-password';

describe('ResetPassword', () => {
  let fixture: ComponentFixture<ResetPassword>;
  let requests: HttpTestingController;
  const url = `${environment.apiBaseUrl}/auth/reset-password`;
  const initialDemo = environment.demo;

  async function create(token: string | null) {
    environment.demo = false;
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(token ? { token } : {}) } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ResetPassword);
    requests = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function fill(password: string, confirmation = password) {
    for (const [id, value] of [['#reset-password', password], ['#reset-confirmation', confirmation]]) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(id);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  afterEach(() => {
    environment.demo = initialDemo;
    requests.verify();
  });

  it('shows the invalid-link state without a token and sends nothing', async () => {
    await create(null);
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Richiedi un nuovo link');
  });

  it('sends token and new password, then clears the local session', async () => {
    await create('raw-token');
    const auth = TestBed.inject(AuthService);
    const clear = vi.spyOn(auth, 'clearSession');
    fill('una-password-lunga-e-sicura');
    const request = requests.expectOne(url);
    expect(request.request.body).toEqual({ token: 'raw-token', newPassword: 'una-password-lunga-e-sicura' });
    request.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();
    expect(clear).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Password aggiornata');
  });

  it('rejects mismatching or too long passwords before calling the server', async () => {
    await create('raw-token');
    fill('secret123', 'secret124');
    fill('è'.repeat(37));
    requests.expectNone(url);
    expect(fixture.nativeElement.textContent).toContain('massimo 72 byte');
  });

  it('switches to the invalid-link state when the backend rejects the token', async () => {
    await create('used-token');
    fill('secret123');
    requests.expectOne(url).flush(
      { errorName: 'INVALID_PASSWORD_RESET_TOKEN' },
      { status: 400, statusText: 'Bad Request' },
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('è già stato usato');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });
});
