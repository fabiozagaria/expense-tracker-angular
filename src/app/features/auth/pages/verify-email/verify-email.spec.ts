import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { VerifyEmail } from './verify-email';

describe('VerifyEmail', () => {
  let component: VerifyEmail;
  let fixture: ComponentFixture<VerifyEmail>;
  let httpTesting: HttpTestingController;

  async function configureTestBed(token: string | null): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [VerifyEmail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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
});
