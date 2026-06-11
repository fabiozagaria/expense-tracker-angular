import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiEntrate } from './aggiungi-entrate';

describe('AggiungiEntrate', () => {
  let component: AggiungiEntrate;
  let fixture: ComponentFixture<AggiungiEntrate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggiungiEntrate],
    }).compileComponents();

    fixture = TestBed.createComponent(AggiungiEntrate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
