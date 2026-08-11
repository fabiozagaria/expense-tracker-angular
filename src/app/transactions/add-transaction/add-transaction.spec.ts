import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddTransaction } from './add-transaction';

describe('AddTransaction', () => {
  let component: AddTransaction;
  let fixture: ComponentFixture<AddTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransaction],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTransaction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
