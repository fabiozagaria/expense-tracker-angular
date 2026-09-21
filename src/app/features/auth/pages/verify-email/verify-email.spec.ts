import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { VerifyEmail } from './verify-email';

describe('VerifyEmail', () => {
  let component: VerifyEmail;
  let fixture: ComponentFixture<VerifyEmail>;
  let httpTesting: HttpTestingController;

  async function configureTestBed(token: string | null, platform = 'browser'): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [VerifyEmail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platform },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(token ? { token } : {}) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmail);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpTesting?.verify();
  });

  it('verifies the email using the token in the query string', async () => {
    await configureTestBed('test-token');

    fixture.detectChanges();

    const request = httpTesting.expectOne(
      request =>
        request.method === 'POST' &&
        request.url === 'http://localhost:8080/auth/verify-email' &&
        request.params.get('token') === 'test-token',
    );

    request.flush(null);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Email verificata.');
  });

  it('shows an error without issuing a request when the token is missing', async () => {
    await configureTestBed(null);

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('non contiene un token valido');
  });

  it('does not consume a verification token during server rendering', async () => {
    await configureTestBed('test-token', 'server');
    fixture.detectChanges();
    httpTesting.expectNone('http://localhost:8080/auth/verify-email');
  });

  it('does not describe a connection error as an invalid token', async () => {
    await configureTestBed('test-token');
    fixture.detectChanges();
    const request = httpTesting.expectOne(request =>
      request.method === 'POST' && request.url.endsWith('/auth/verify-email'));
    request.flush(null, { status: 0, statusText: 'Unknown Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Controlla la connessione');
    expect(fixture.nativeElement.textContent).not.toContain('non è valido o è scaduto');
  });
});
