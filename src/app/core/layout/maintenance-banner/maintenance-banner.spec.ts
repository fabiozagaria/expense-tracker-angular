import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { MaintenanceBanner } from './maintenance-banner';

describe('MaintenanceBanner', () => {
  const initial = environment.maintenance;

  async function create(maintenance: boolean): Promise<ComponentFixture<MaintenanceBanner>> {
    environment.maintenance = maintenance;
    await TestBed.configureTestingModule({ imports: [MaintenanceBanner] }).compileComponents();
    const fixture = TestBed.createComponent(MaintenanceBanner);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => {
    environment.maintenance = initial;
  });

  it('explains the outage and the expected recovery time while maintenance is active', async () => {
    const fixture = await create(true);
    const banner = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain('Servizio temporaneamente sospeso');
    expect(banner.textContent).toContain('database');
    expect(banner.textContent).toContain('piano gratuito');
    expect(banner.textContent).toContain('24–48 ore');
  });

  it('renders nothing when maintenance is off', async () => {
    const fixture = await create(false);
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('');
  });
});
