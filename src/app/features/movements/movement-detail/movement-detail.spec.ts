import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MovementKind } from '../movement-api.service';
import { MovementDetail } from './movement-detail';

describe('MovementDetail', () => {
  let fixture: ComponentFixture<MovementDetail>;
  let requests: HttpTestingController;

  async function create(kind: MovementKind, id: string) {
    await TestBed.configureTestingModule({
      imports: [MovementDetail],
      providers: [
        provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { kind }, paramMap: convertToParamMap({ id }) } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovementDetail);
    requests = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => requests.verify());

  it('loads an expense from GET /api/expenses/{id}', async () => {
    await create('expenses', '1');
    requests.expectOne(`${environment.apiBaseUrl}/api/expenses/1`).flush({
      id: 1, title: 'Spesa di prova', description: null, amount: 10, category: 'groceries', date: '2026-08-11',
    });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Dettaglio spesa');
    expect(text).toContain('Alimentari');
    expect(text).toContain('Nessuna descrizione.');
  });

  it('loads an income from GET /api/incomes/{id} and links back to the income list', async () => {
    await create('incomes', '7');
    requests.expectOne(`${environment.apiBaseUrl}/api/incomes/7`).flush({
      id: 7, title: 'Stipendio', description: 'Ottobre', amount: 2000, category: 'salary', date: '2026-10-01',
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Dettaglio entrata');
    expect(fixture.nativeElement.textContent).toContain('Stipendio');
    expect(fixture.nativeElement.querySelector('a[href="/incomes"]')).toBeTruthy();
  });

  it('treats a 404 from another owner as not found and skips invalid ids', async () => {
    await create('incomes', '9');
    requests.expectOne(`${environment.apiBaseUrl}/api/incomes/9`).flush(
      { errorName: 'NOT_FOUND_INCOME' }, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nessuna entrata trovata');
  });
});
