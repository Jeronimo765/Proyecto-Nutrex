import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private readonly plansApiUrl = `${environment.gatewayUrl}/api/plans`;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.plansApiUrl);
  }
}
