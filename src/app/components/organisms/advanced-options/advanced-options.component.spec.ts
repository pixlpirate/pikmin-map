import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedOptionsComponent } from './advanced-options.component';

describe('AdvancedOptionsComponent', () => {
  let component: AdvancedOptionsComponent;
  let fixture: ComponentFixture<AdvancedOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvancedOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
