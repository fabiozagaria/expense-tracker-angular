import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Profile, ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  let service: ProfileApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProfileApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the profile of the logged-in user from GET /api/me', () => {
    let profile: Profile | undefined;
    service.getProfile().subscribe(result => (profile = result));
    const request = http.expectOne(`${environment.apiBaseUrl}/api/me`);
    expect(request.request.method).toBe('GET');
    request.flush({ username: 'utente1', email: 'utente1@example.test' });
    expect(profile).toEqual({ username: 'utente1', email: 'utente1@example.test' });
  });
});
