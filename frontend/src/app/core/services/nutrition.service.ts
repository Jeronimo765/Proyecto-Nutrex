import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface DailySummary {
  calories: number;
  caloriesGoal: number;
  carbs: number;
  carbsGoal: number;
  protein: number;
  proteinGoal: number;
  fats: number;
  fatsGoal: number;
  fiber: number;
  fiberGoal: number;
}

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  getDailySummary(_date: string): Observable<DailySummary> {
    return of({
      calories: 1240,
      caloriesGoal: 1800,
      carbs: 110,
      carbsGoal: 200,
      protein: 62,
      proteinGoal: 80,
      fats: 24,
      fatsGoal: 65,
      fiber: 22,
      fiberGoal: 25
    });
  }
}
