import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Plan, PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {
  planSeleccionado: Plan | null = null;
  planActivo: Plan | null = null;
  planes: Plan[] = [];
  loading = true;
  error = false;
  errorMessage = '';

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.planActivo = this.planService.getSelectedPlan();

    this.planService.getPlans().subscribe({
      next: (plans) => {
        this.planes = plans;
        if (this.planActivo) {
          this.planActivo = plans.find((plan) => plan.id === this.planActivo?.id) ?? this.planActivo;
          this.planSeleccionado = this.planActivo;
        }
        this.loading = false;
        this.error = false;
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.error = true;
        const detail = error.status
          ? `Error ${error.status}${error.statusText ? `: ${error.statusText}` : ''}`
          : 'No se pudo conectar con la API';
        this.errorMessage = `${detail}${error.url ? ` (${error.url})` : ''}`;
      }
    });
  }

  seleccionar(plan: Plan): void {
    this.planSeleccionado = this.planSeleccionado?.id === plan.id ? null : plan;
  }

  activarPlan(plan: Plan): void {
    this.planService.saveSelectedPlan(plan);
    this.planActivo = plan;
    this.planSeleccionado = plan;
  }
}
