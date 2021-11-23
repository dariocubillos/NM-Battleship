import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipIndicatorComponent } from './ship-indicator.component';

describe('ShipIndicatorComponent', () => {
  let component: ShipIndicatorComponent;
  let fixture: ComponentFixture<ShipIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
