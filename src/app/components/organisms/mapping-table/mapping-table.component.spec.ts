import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingTableComponent } from './mapping-table.component';

describe('MappingTableComponent', () => {
  let component: MappingTableComponent;
  let fixture: ComponentFixture<MappingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MappingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
