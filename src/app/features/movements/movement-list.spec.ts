import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MovementList } from './movement-list';
import { environment } from '../../../environments/environment';

describe('Movement lists', () => {
  let http: HttpTestingController;
  const base = `${environment.apiBaseUrl}/api/incomes`;
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [MovementList], providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      {provide: ActivatedRoute, useValue: {snapshot: {data: {kind: 'incomes'}}}}]});
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('loads server pagination, applies filters and cancels stale requests', () => {
    const fixture = TestBed.createComponent(MovementList);
    const first = http.expectOne(r => r.url === `${base}/search`);
    expect(first.request.params.get('order')).toBe('newest');
    fixture.componentInstance['filters'].setValue({month: '2026-10', query: '25,50', order: 'oldest'});
    fixture.componentInstance['reload']();
    expect(first.cancelled).toBe(true);
    const filtered = http.expectOne(r => r.url === `${base}/search`);
    expect(filtered.request.params.get('month')).toBe('2026-10');
    expect(filtered.request.params.get('query')).toBe('25,50');
    filtered.flush({content: [], number: 0, size: 10, totalElements: 0, totalPages: 0});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nessun movimento trovato');
  });
  it('keeps edits after server failure and reloads after successful deletion', () => {
    const fixture = TestBed.createComponent(MovementList);
    const item = {id: 7, title: 'Stipendio', amount: 1200, category: 'salary', description: null, date: '2026-01-01'};
    http.expectOne(r => r.url === `${base}/search`).flush({content: [item], number: 0, size: 10, totalElements: 1, totalPages: 1});
    fixture.componentInstance['edit'](item);
    fixture.componentInstance['save']();
    http.expectOne(`${base}/7`).flush({}, {status: 500, statusText: 'Error'});
    expect(fixture.componentInstance['editing']()?.id).toBe(7);
    expect(fixture.componentInstance['busy']()).toBe(false);
    fixture.componentInstance['remove'](7);
    const deleted = http.expectOne(`${base}/7`);
    expect(deleted.request.method).toBe('DELETE'); deleted.flush({});
    http.expectOne(r => r.url === `${base}/search`).flush({content: [], number: 0, size: 10, totalElements: 0, totalPages: 0});
    expect(fixture.componentInstance['result']()?.totalElements).toBe(0);
  });
});
