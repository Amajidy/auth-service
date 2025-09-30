import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShahkarComponent } from './shahkar.component';

describe('ShahkarComponent', () => {
  let component: ShahkarComponent;
  let fixture: ComponentFixture<ShahkarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShahkarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShahkarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
