import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseList } from './expense-list';

describe('ExpenseList', () => {
  let component: ExpenseList;
  let fixture: ComponentFixture<ExpenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseList],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
