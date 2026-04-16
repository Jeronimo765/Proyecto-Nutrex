import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { FoodAnalyzerComponent } from './food-analyzer/food-analyzer.component';
import { MealTrackerComponent } from './meal-tracker/meal-tracker.component';
import { PlanesComponent } from './planes/planes.component';
import { RecetasComponent } from './recetas/recetas.component';

@NgModule({
  declarations: [
    FoodAnalyzerComponent,
    MealTrackerComponent,
    PlanesComponent,
    RecetasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NutritionRoutingModule
  ]
})
export class NutritionModule {}