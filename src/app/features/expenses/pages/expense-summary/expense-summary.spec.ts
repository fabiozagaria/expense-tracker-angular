import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSummary } from './expense-summary';

describe('ExpenseSummary', () => {
  let component: ExpenseSummary;
  let fixture: ComponentFixture<ExpenseSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
