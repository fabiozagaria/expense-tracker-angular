import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpense } from './add-expense';

describe('AddExpense', () => {
  let component: AddExpense;
  let fixture: ComponentFixture<AddExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpense],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
