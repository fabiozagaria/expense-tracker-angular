import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetail } from './expense-detail';

describe('ExpenseDetail', () => {
  let component: ExpenseDetail;
  let fixture: ComponentFixture<ExpenseDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
