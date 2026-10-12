import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  const initialDemo = environment.demo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    environment.demo = initialDemo;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps registration reachable in the demo', () => {
    environment.demo = true;
    fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a[href="/register"]') as HTMLAnchorElement;
    expect(link.textContent).toContain('Registrati');
    expect(link.title).toContain('registrazione online non ancora disponibile');
  });
});

