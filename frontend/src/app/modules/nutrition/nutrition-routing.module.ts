import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanesComponent } from './planes/planes.component';
import { RecetasComponent } from './recetas/recetas.component';

const routes: Routes = [
  { path: 'planes', component: PlanesComponent },
  { path: 'recetas', component: RecetasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule {}
