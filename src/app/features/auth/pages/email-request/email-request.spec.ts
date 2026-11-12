import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { EmailRequest, EmailRequestMode } from './email-request';

describe('EmailRequest', () => {
  let fixture: ComponentFixture<EmailRequest>;
  let requests: HttpTestingController;
  const initialDemo = environment.demo;
  const initialMaintenance = environment.maintenance;

  async function create(mode: EmailRequestMode, email?: string) {
    environment.demo = false;
    await TestBed.configureTestingModule({
      imports: [EmailRequest],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { mode }, queryParamMap: convertToParamMap(email ? { email } : {}) } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EmailRequest);
    requests = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function type(value: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#recovery-email');
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submit() {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  afterEach(() => {
    environment.demo = initialDemo;
    environment.maintenance = initialMaintenance;
    requests.verify();
  });

  it('requests a password reset and shows a neutral confirmation', async () => {
    await create('password');
    type(' user@example.test ');
    submit();
    const request = requests.expectOne(`${environment.apiBaseUrl}/auth/forgot-password`);
    expect(request.request.body).toEqual({ email: 'user@example.test' });
    request.flush(null, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Se l’indirizzo appartiene a un account verificato');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });

  it('resends the verification link to the prefilled email', async () => {
    await create('verification', 'user@example.test');
    submit();
    requests.expectOne(`${environment.apiBaseUrl}/auth/resend-verification`)
      .flush(null, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('valido per 10 minuti');
  });

  it('blocks an invalid email and explains a disabled mail service', async () => {
    await create('password');
    type('not-an-email');
    submit();
    requests.expectNone(`${environment.apiBaseUrl}/auth/forgot-password`);
    expect(fixture.nativeElement.querySelector('#recovery-email-error')).toBeTruthy();

    type('user@example.test');
    submit();
    requests.expectOne(`${environment.apiBaseUrl}/auth/forgot-password`)
      .flush({ errorName: 'SERVICE_UNAVAILABLE' }, { status: 503, statusText: 'Service Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('non è disponibile in questo momento');
  });

  it('disables the request during maintenance and sends nothing', async () => {
    environment.maintenance = true;
    await create('password');
    type('user@example.test');
    expect((fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true);
    submit();
    requests.expectNone(() => true);
  });
});
