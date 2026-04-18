import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class NutritionService {
  private readonly foodApiUrl = `${environment.gatewayUrl}/api/food`;
  private readonly nutritionApiUrl = `${environment.gatewayUrl}/api/nutrition`;

  constructor(private http: HttpClient) {}

  getDailySummary(date: string): Observable<DailySummary> {
    return this.http.get<DailySummary>(`${this.nutritionApiUrl}/daily-summary`, {
      params: { date }
    });
  }

  analyzePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    ['DIABETES_T2'].forEach(c => formData.append('conditions', c));

    return this.http.post<any>(`${this.foodApiUrl}/analyze-image`, formData);
  }

  analyzeFoodText(description: string, conditions: string[]): Observable<any> {
    return this.http.post<any>(`${this.foodApiUrl}/analyze-text`, {
      food_description: description,
      user_conditions: conditions
    });
  }
}
