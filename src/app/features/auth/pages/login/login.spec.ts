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
  const initialRegistrationEnabled = environment.registrationEnabled;

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
    environment.registrationEnabled = initialRegistrationEnabled;
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the registration form in the demo and explains online availability', () => {
    environment.demo = true;
    environment.registrationEnabled = false;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/register"]')?.textContent).toContain('Registrati');
    expect(fixture.nativeElement.textContent).toContain('la registrazione online attende il servizio email di verifica');
    expect(fixture.nativeElement.textContent).toContain('Prova la demo');
  });

  it('keeps demo login available after enabling personal registration', () => {
    environment.demo = true;
    environment.registrationEnabled = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Prova la demo');
    expect(fixture.nativeElement.textContent).not.toContain('la registrazione online attende il servizio email');
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
});

