import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AddIncome } from './add-income';
import { IncomeService } from '../../services/income.service';

describe('AddIncome', () => {
  let component: AddIncome;
  let fixture: ComponentFixture<AddIncome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIncome],
      providers: [
        provideRouter([]),
        { provide: IncomeService, useValue: { addIncome: () => of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddIncome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
