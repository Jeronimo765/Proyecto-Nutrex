import { Component, OnInit } from '@angular/core';
import { Plan, PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {
  planSeleccionado: Plan | null = null;
  planes: Plan[] = [];
  loading = true;

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.planService.getPlans().subscribe({
      next: (plans) => {
        this.planes = plans;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  seleccionar(plan: Plan): void {
    this.planSeleccionado = this.planSeleccionado?.id === plan.id ? null : plan;
  }
}
