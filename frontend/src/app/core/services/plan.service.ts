import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
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
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly selectedPlanStorageKey = 'nutrex_selected_plan';
  private readonly plansApiUrl = `${environment.gatewayUrl || ''}/api/plans`;
  private readonly fallbackPlansApiUrl = 'http://localhost:8080/api/plans';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.fetchPlans(this.plansApiUrl).pipe(
      catchError(() => {
        if (this.plansApiUrl === this.fallbackPlansApiUrl) {
          return throwError(() => new Error('No se pudieron cargar los planes.'));
        }

        return this.fetchPlans(this.fallbackPlansApiUrl);
      })
    );
  }

  saveSelectedPlan(plan: Plan): void {
    localStorage.setItem(this.selectedPlanStorageKey, JSON.stringify(plan));
  }

  getSelectedPlan(): Plan | null {
    const rawPlan = localStorage.getItem(this.selectedPlanStorageKey);

    if (!rawPlan) {
      return null;
    }

    try {
      return JSON.parse(rawPlan) as Plan;
    } catch {
      localStorage.removeItem(this.selectedPlanStorageKey);
      return null;
    }
  }

  private fetchPlans(url: string): Observable<Plan[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
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

    if (!trimmed) {
      throw new Error('La respuesta de planes llego vacia.');
    }

    if (trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')) {
      throw new Error('La respuesta de planes devolvio HTML en lugar de JSON.');
    }

    const parsed = JSON.parse(trimmed) as Plan[];

    if (!Array.isArray(parsed)) {
      throw new Error('La respuesta de planes no tiene el formato esperado.');
    }

    return parsed;
  }
}
