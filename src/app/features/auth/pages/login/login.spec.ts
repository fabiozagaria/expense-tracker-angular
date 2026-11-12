import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  const initialDemo = environment.demo;
  const initialMaintenance = environment.maintenance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    environment.demo = initialDemo;
    environment.maintenance = initialMaintenance;
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the registration form in the demo and explains online availability', () => {
    environment.demo = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/register"]')?.textContent).toContain('Registrati');
    expect(fixture.nativeElement.textContent).toContain('registrati e conferma il link ricevuto via email');
    expect(fixture.nativeElement.textContent).toContain('Prova la demo');
  });

  it('submits credentials to the backend and shows an invalid credentials error', () => {
    const username = fixture.nativeElement.querySelector('#login-username') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#login-password') as HTMLInputElement;
    username.value = 'verticaluser1';
    username.dispatchEvent(new Event('input'));
    password.value = 'wrongpass';
    password.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const request = TestBed.inject(HttpTestingController).expectOne('http://localhost:8080/auth/login');
    expect(request.request.body).toEqual({ username: 'verticaluser1', password: 'wrongpass' });
    expect(request.request.withCredentials).toBe(true);
    request.flush(null, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Username o password non corretti.');
    TestBed.inject(HttpTestingController).verify();
  });

  it('offers the forgot-password page and a new verification link after 403 EMAIL_NOT_VERIFIED', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/forgot-password"]')).toBeTruthy();
    const username = fixture.nativeElement.querySelector('#login-username') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#login-password') as HTMLInputElement;
    username.value = 'unverified1';
    username.dispatchEvent(new Event('input'));
    password.value = 'secret123';
    password.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    TestBed.inject(HttpTestingController).expectOne('http://localhost:8080/auth/login')
      .flush({ errorName: 'EMAIL_NOT_VERIFIED' }, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Verifica prima la tua email');
    expect(fixture.nativeElement.querySelector('a[href="/resend-verification"]')).toBeTruthy();
  });

  it('disables the shared demo button during maintenance and sends nothing', () => {
    environment.demo = true;
    environment.maintenance = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.demo-button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    button.click();
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });

  it('disables the login submit during maintenance and sends nothing', () => {
    environment.maintenance = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.login-submit') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });
});
