import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncome } from './add-income';

describe('AddIncome', () => {
  let component: AddIncome;
  let fixture: ComponentFixture<AddIncome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIncome],
    }).compileComponents();

    fixture = TestBed.createComponent(AddIncome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
