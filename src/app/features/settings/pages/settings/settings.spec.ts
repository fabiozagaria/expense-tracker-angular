import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { Settings } from './settings';

describe('Settings', () => {
  let fixture: ComponentFixture<Settings>;
  let requests: HttpTestingController;
  const meUrl = `${environment.apiBaseUrl}/api/me`;
  const forgotUrl = `${environment.apiBaseUrl}/auth/forgot-password`;
  const profile = { username: 'utente1', email: 'utente1@example.test' };
  const initialDemo = environment.demo;

  async function create(sessionUser = 'utente1', deployedDemo = false) {
    environment.demo = deployedDemo;
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    requests = TestBed.inject(HttpTestingController);
    // La sessione serve solo a riconoscere l'account demo: lo username sta nel claim `sub` del JWT.
    TestBed.inject(AuthService).login(sessionUser, 'secret123').subscribe();
    requests.expectOne(`${environment.apiBaseUrl}/auth/login`)
      .flush({ accessToken: `h.${btoa(JSON.stringify({ sub: sessionUser }))}.s` });
    fixture = TestBed.createComponent(Settings);
    fixture.detectChanges();
  }

  const text = () => fixture.nativeElement.textContent as string;
  const sendButton = () => fixture.nativeElement.querySelector('button.send-link') as HTMLButtonElement | null;

  afterEach(() => {
    environment.demo = initialDemo;
    requests.verify();
  });

  it('shows the monogram, username and email from GET /api/me', async () => {
    await create();
    requests.expectOne(meUrl).flush(profile);
    fixture.detectChanges();
    expect(text()).toContain('utente1');
    expect(text()).toContain('utente1@example.test');
    expect(fixture.nativeElement.querySelector('.monogram').textContent.trim()).toBe('U');
  });

  it('sends the reset link to the profile email and replaces the button with the confirmation', async () => {
    await create();
    requests.expectOne(meUrl).flush(profile);
    fixture.detectChanges();
    sendButton()!.click();
    const request = requests.expectOne(forgotUrl);
    expect(request.request.body).toEqual({ email: 'utente1@example.test' });
    request.flush(null, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();
    expect(text()).toContain('valido per 30 minuti');
    expect(sendButton()).toBeNull();
  });

  it('shows a note instead of the button for the shared demo account and sends nothing', async () => {
    await create('portfolio-demo');
    requests.expectOne(meUrl).flush({ username: 'portfolio-demo', email: 'portfolio-demo@example.invalid' });
    fixture.detectChanges();
    expect(text()).toContain('non si può cambiare');
    expect(sendButton()).toBeNull();
    requests.expectNone(forgotUrl);
  });

  it('shows an error with a retry and no password button when the profile cannot be loaded', async () => {
    await create();
    requests.expectOne(meUrl).flush(null, { status: 503, statusText: 'Service Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(sendButton()).toBeNull();
    const retry = fixture.nativeElement.querySelector('button.retry') as HTMLButtonElement;
    retry.click();
    requests.expectOne(meUrl).flush(profile);
    fixture.detectChanges();
    expect(text()).toContain('utente1@example.test');
    expect(sendButton()).toBeTruthy();
  });

  it('explains the rate limit with the Retry-After wait and keeps the button', async () => {
    await create();
    requests.expectOne(meUrl).flush(profile);
    fixture.detectChanges();
    sendButton()!.click();
    requests.expectOne(forgotUrl).flush(
      { errorName: 'RATE_LIMITED' },
      { status: 429, statusText: 'Too Many Requests', headers: { 'Retry-After': '45' } },
    );
    fixture.detectChanges();
    expect(text()).toContain('Troppi tentativi. Riprova tra 45 secondi.');
    expect(sendButton()).toBeTruthy();
  });

  it('reports a failed email delivery', async () => {
    await create();
    requests.expectOne(meUrl).flush(profile);
    fixture.detectChanges();
    sendButton()!.click();
    requests.expectOne(forgotUrl).flush(
      { errorName: 'EMAIL_DELIVERY_FAILED' },
      { status: 503, statusText: 'Service Unavailable' },
    );
    fixture.detectChanges();
    expect(text()).toContain('Invio email non riuscito');
  });

  it('explains the server wake-up while the link is sent on the deployed demo', async () => {
    await create('utente1', true);
    requests.expectOne(meUrl).flush(profile);
    fixture.detectChanges();
    sendButton()!.click();
    fixture.detectChanges();
    // Prima del POST il client aspetta che il server risponda a /health: può richiedere minuti.
    const health = requests.expectOne(`${environment.apiBaseUrl}/health`);
    expect(text()).toContain('può richiedere 2–3 minuti');
    health.flush({ status: 'up' });
    requests.expectOne(forgotUrl).flush(null, { status: 202, statusText: 'Accepted' });
  });
});
