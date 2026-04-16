import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodAnalyzerComponent } from './food-analyzer.component';

describe('FoodAnalyzerComponent', () => {
  let component: FoodAnalyzerComponent;
  let fixture: ComponentFixture<FoodAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodAnalyzerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
