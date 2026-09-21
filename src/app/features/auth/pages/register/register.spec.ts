import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  it('submits the backend DTO and waits for success before showing the email instructions', async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
    const values: Record<string, string> = {
      '#register-username': 'verticaluser1',
      '#register-email': 'vertical@example.test',
      '#register-password': 'secret123',
    };
    for (const [selector, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const requests = TestBed.inject(HttpTestingController);
    const request = requests.expectOne('http://localhost:8080/auth/register');
    expect(request.request.body).toEqual({
      username: 'verticaluser1', email: 'vertical@example.test', password: 'secret123',
    });
    expect(fixture.nativeElement.textContent).not.toContain('Account creato.');
    request.flush({ msg: 'Account creato' }, { status: 201, statusText: 'Created' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Account creato.');
    requests.verify();
  });
});
