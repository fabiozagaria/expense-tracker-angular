import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { environment } from '../../../../../environments/environment';
import { routes } from '../../../../app.routes';
import { AuthService } from '../../services/auth.service';
import { Register } from './register';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let requests: HttpTestingController;
  const initialDemo = environment.demo;
  const initialApiBaseUrl = environment.apiBaseUrl;
  const registrationUrl = `${initialApiBaseUrl}/auth/register`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    requests = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.demo = initialDemo;
    environment.apiBaseUrl = initialApiBaseUrl;
    requests.verify();
  });

  function createForm(): void {
    fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
  }

  function fillForm(overrides: Partial<Record<'username' | 'email' | 'password', string>> = {}): void {
    const values = { username: 'verticaluser1', email: 'vertical@example.test', password: 'secret123', ...overrides };
    for (const [name, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(`#register-${name}`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  }

  function submitForm(): void {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('submits the backend DTO and waits for success before showing email verification instructions', () => {
    createForm();
    fillForm();
    submitForm();

    const request = requests.expectOne(registrationUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      username: 'verticaluser1', email: 'vertical@example.test', password: 'secret123',
    });
    expect(fixture.nativeElement.textContent).not.toContain('Account creato.');
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
    request.flush({ msg: 'Account creato' }, { status: 201, statusText: 'Created' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Controlla la tua email e apri il link di verifica prima di accedere.');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/login');
    expect(TestBed.inject(AuthService).accessToken()).toBeNull();
  });

  it('does not send an invalid form and shows field feedback', () => {
    createForm();
    submitForm();
    requests.expectNone(registrationUrl);
    expect(fixture.nativeElement.querySelectorAll('input[aria-invalid="true"]').length).toBe(3);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
  });

  it.each([
    { username: 'short' },
    { email: 'invalid-address' },
    { password: '12345' },
  ])('blocks invalid field values: %o', values => {
    createForm();
    fillForm(values);
    submitForm();
    requests.expectNone(registrationUrl);
    expect(fixture.nativeElement.querySelector('input[aria-invalid="true"]')).toBeTruthy();
  });

  it('prevents another request while registration is in progress', () => {
    createForm();
    fillForm();
    submitForm();
    submitForm();
    requests.expectOne(registrationUrl).flush({ msg: 'Account creato' }, { status: 201, statusText: 'Created' });
  });

  it.each([
    ['EMAIL_ALREADY_EXISTS', 'Email già registrata. Usa un altro indirizzo o accedi.'],
    ['USERNAME_ALREADY_EXISTS', 'Username già registrato. Scegli un altro username.'],
    ['CONFLICT', 'Username o email già registrati.'],
  ])('shows the backend conflict %s and allows correction', (errorName, expectedMessage) => {
    createForm();
    fillForm();
    submitForm();
    requests.expectOne(registrationUrl).flush({ errorName }, { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(expectedMessage);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
    expect((fixture.nativeElement.querySelector('#register-username') as HTMLInputElement).value).toBe('verticaluser1');
    expect(fixture.nativeElement.textContent).not.toContain('Account creato.');
  });

  it.each([0, 503])('shows a connection message for status %s', status => {
    createForm();
    fillForm();
    submitForm();
    requests.expectOne(registrationUrl).flush(null, { status, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Server non disponibile. Controlla la connessione');
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
  });

  it('submits registration online while retaining the demo login', () => {
    environment.demo = true;
    environment.apiBaseUrl = '';
    createForm();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
    fillForm();
    submitForm();
    const request = requests.expectOne('/auth/register');
    expect(request.request.method).toBe('POST');
    request.flush({ msg: 'Account creato' }, { status: 201, statusText: 'Created' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Account creato.');
  });

  it('explains email delivery failure and allows retry', () => {
    createForm();
    fillForm();
    submitForm();
    requests.expectOne(registrationUrl).flush({ errorName: 'EMAIL_DELIVERY_FAILED' },
      { status: 503, statusText: 'Service Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Invio email non riuscito.');
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Account creato.');
  });

  it('redirects the Italian alias to the canonical registration page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/registrati', Register);
    expect(TestBed.inject(Router).url).toBe('/register');
    expect(harness.routeNativeElement?.querySelector('form')).toBeTruthy();
    expect(harness.routeNativeElement?.textContent).toContain('Crea un account');
  });
});

