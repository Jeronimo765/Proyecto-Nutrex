import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DailySummary {
  calories:     number;
  caloriesGoal: number;
  carbs:        number;
  carbsGoal:    number;
  protein:      number;
  proteinGoal:  number;
  fats:         number;
  fatsGoal:     number;
  fiber:        number;
  fiberGoal:    number;
}

@Injectable({ providedIn: 'root' })
export class NutritionService {

  constructor(private http: HttpClient) {}

  // ── Resumen diario (datos mock por ahora) ──
  getDailySummary(_date: string): Observable<DailySummary> {
    return of({
      calories:     1240,
      caloriesGoal: 1800,
      carbs:        110,
      carbsGoal:    200,
      protein:      62,
      proteinGoal:  80,
      fats:         24,
      fatsGoal:     65,
      fiber:        22,
      fiberGoal:    25
    });
  }

  // ── Análisis de foto con IA ──
  analyzePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    ['DIABETES_T2'].forEach(c => formData.append('conditions', c));
    return this.http.post<any>(
      `${environment.aiServiceUrl}/api/food/analyze-image`,
      formData
    );
  }

  // ── Análisis por texto con IA ──
  analyzeFoodText(description: string, conditions: string[]): Observable<any> {
    return this.http.post<any>(
      `${environment.aiServiceUrl}/api/food/analyze-text`,
      { food_description: description, user_conditions: conditions }
    );
  }

}