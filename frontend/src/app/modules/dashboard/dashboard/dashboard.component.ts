import { Component, OnInit } from '@angular/core';

import {
  DailySummary,
  NutritionService
} from '../../../core/services/nutrition.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  summary: DailySummary | null = null;
  today = new Date().toISOString().split('T')[0];
  loading = true;

  readonly greetings = ['Buenos dias', 'Buenas tardes', 'Buenas noches'];

  constructor(private nutritionService: NutritionService) {}

  ngOnInit(): void {
    this.nutritionService.getDailySummary(this.today).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return this.greetings[0];
    }
    if (hour < 18) {
      return this.greetings[1];
    }
    return this.greetings[2];
  }

  get calories(): number {
    return this.summary?.calories ?? 0;
  }

  get caloriesGoal(): number {
    return this.summary?.caloriesGoal ?? 1800;
  }

  get carbs(): number {
    return this.summary?.carbs ?? 0;
  }

  get carbsGoal(): number {
    return this.summary?.carbsGoal ?? 200;
  }

  get protein(): number {
    return this.summary?.protein ?? 0;
  }

  get proteinGoal(): number {
    return this.summary?.proteinGoal ?? 80;
  }

  get fats(): number {
    return this.summary?.fats ?? 0;
  }

  get fatsGoal(): number {
    return this.summary?.fatsGoal ?? 65;
  }

  get fiber(): number {
    return this.summary?.fiber ?? 0;
  }

  get fiberGoal(): number {
    return this.summary?.fiberGoal ?? 25;
  }

  getProgress(current: number, goal: number): number {
    if (!goal) {
      return 0;
    }
    return Math.min(Math.round((current / goal) * 100), 100);
  }

  getProgressClass(percent: number): string {
    if (percent >= 90) {
      return 'progress__fill--danger';
    }
    if (percent >= 75) {
      return 'progress__fill--warning';
    }
    return '';
  }
}
