import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorCoordinateComponent } from './color-coordinate.component';

describe('ColorCoordinateComponent', () => {
  let component: ColorCoordinateComponent;
  let fixture: ComponentFixture<ColorCoordinateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorCoordinateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorCoordinateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
