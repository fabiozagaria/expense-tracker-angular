import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioSpesa } from './dettaglio-spesa';

describe('DettaglioSpesa', () => {
  let component: DettaglioSpesa;
  let fixture: ComponentFixture<DettaglioSpesa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioSpesa],
    }).compileComponents();

    fixture = TestBed.createComponent(DettaglioSpesa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
