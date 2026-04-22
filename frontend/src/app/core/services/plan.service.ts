import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError, retry, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SemanaPlan {
  semana: number;
  desayuno: string;
  almuerzo: string;
  cena: string;
}

export interface Plan {
  id: string;
  condicion: string;
  tipoPlan: string;
  objetivo: string;
  descripcion: string;
  enfoque: string[];
  alimentos: string[];
  evitar: string[];
  semanas: SemanaPlan[];
  dailyCaloriesGoal?: number;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly selectedPlanStorageKey = 'nutrex_selected_plan';
  private readonly plansApiUrl = `${environment.gatewayUrl}/plans`;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.fetchPlans(this.plansApiUrl);
  }

  saveSelectedPlan(plan: Plan): void {
    localStorage.setItem(
      this.selectedPlanStorageKey,
      JSON.stringify(this.normalizePlan(plan))
    );
  }

  getSelectedPlan(): Plan | null {
    const rawPlan = localStorage.getItem(this.selectedPlanStorageKey);
    if (!rawPlan) return null;
    try {
      return this.normalizePlan(JSON.parse(rawPlan) as Plan);
    } catch {
      localStorage.removeItem(this.selectedPlanStorageKey);
      return null;
    }
  }

  private fetchPlans(url: string): Observable<Plan[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      retry({ count: 3, delay: (_, retryCount) => timer(retryCount * 3000) }),
      map((response) => this.parsePlansResponse(response)),
      catchError((error) => {
        if (typeof error?.error === 'string') {
          return of(error.error).pipe(
            map((response) => this.parsePlansResponse(response)),
            catchError(() => throwError(() => error))
          );
        }
        return throwError(() => error);
      })
    );
  }

  private parsePlansResponse(response: string): Plan[] {
    const trimmed = response.trim();
    if (!trimmed) throw new Error('La respuesta de planes llego vacia.');
    if (trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')) {
      throw new Error('La respuesta de planes devolvio HTML en lugar de JSON.');
    }
    const parsed = JSON.parse(trimmed) as Plan[];
    if (!Array.isArray(parsed)) throw new Error('La respuesta de planes no tiene el formato esperado.');
    return parsed.map((plan) => this.normalizePlan(plan));
  }

  private normalizePlan(plan: Plan): Plan {
    return {
      ...plan,
      dailyCaloriesGoal: plan.dailyCaloriesGoal ?? this.estimateCaloriesGoal(plan)
    };
  }

  private estimateCaloriesGoal(plan: Plan): number {
    const text = `${plan.id} ${plan.condicion} ${plan.tipoPlan} ${plan.objetivo} ${plan.descripcion}`.toLowerCase();

    if (this.matchesAny(text, ['bajar peso', 'perder peso', 'deficit', 'adelgazar'])) {
      return 1600;
    }

    if (this.matchesAny(text, ['ganar masa', 'hipertrofia', 'subir masa', 'aumentar musculo'])) {
      return 2300;
    }

    if (this.matchesAny(text, ['diabetes', 'glucosa', 'resistencia a la insulina'])) {
      return 1800;
    }

    if (this.matchesAny(text, ['renal', 'rinon', 'riñon', 'hipertension', 'hipertensión', 'cardi'])) {
      return 1700;
    }

    if (this.matchesAny(text, ['embarazo', 'gestacion', 'gestación'])) {
      return 2200;
    }

    return 2000;
  }

  private matchesAny(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }
}
