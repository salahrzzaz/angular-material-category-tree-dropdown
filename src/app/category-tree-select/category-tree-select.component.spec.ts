import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeSelectComponent } from './category-tree-select.component';

describe('CategoryTreeSelectComponent', () => {
  let component: CategoryTreeSelectComponent;
  let fixture: ComponentFixture<CategoryTreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTreeSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryTreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
