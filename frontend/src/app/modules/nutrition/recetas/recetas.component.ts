import { Component } from '@angular/core';

interface Receta {
  id: number;
  nombre: string;
  categoria: string;
  condicion: string[];
  tiempo: string;
  calorias: number;
  dificultad: string;
  imagen: string;
  ingredientes: string[];
  pasos: string[];
  macros: { proteinas: number; carbos: number; grasas: number };
}

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss']
})
export class RecetasComponent {
  filtroActivo = 'todas';
  recetaSeleccionada: Receta | null = null;

  readonly filtros = [
    { key: 'todas', label: 'Todas' },
    { key: 'diabetes', label: 'Diabetes' },
    { key: 'hipertension', label: 'Hipertension' },
    { key: 'colesterol', label: 'Colesterol' },
    { key: 'renal', label: 'Renal' },
    { key: 'peso', label: 'Control de peso' }
  ];

  readonly recetas: Receta[] = [
    {
      id: 1,
      nombre: 'Bowl de quinoa con pollo y espinaca',
      categoria: 'Almuerzo',
      condicion: ['diabetes', 'colesterol', 'peso'],
      tiempo: '25 min',
      calorias: 380,
      dificultad: 'Facil',
      imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
      ingredientes: ['1 taza de quinoa cocida', '150 g de pechuga de pollo', '2 tazas de espinaca', '1/2 aguacate', 'Limon y aceite de oliva'],
      pasos: ['Cocinar la quinoa por 15 minutos', 'Sellar el pollo a la plancha con ajo', 'Saltear la espinaca por 2 minutos', 'Montar el bowl y agregar aguacate', 'Aliñar con limon y oliva'],
      macros: { proteinas: 38, carbos: 32, grasas: 12 }
    },
    {
      id: 2,
      nombre: 'Salmon al horno con brocoli',
      categoria: 'Cena',
      condicion: ['colesterol', 'hipertension', 'peso'],
      tiempo: '30 min',
      calorias: 320,
      dificultad: 'Facil',
      imagen: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
      ingredientes: ['200 g de filete de salmon', '2 tazas de brocoli', 'Aceite de oliva', 'Ajo y limon', 'Pimienta negra'],
      pasos: ['Precalentar el horno a 200 C', 'Marinar el salmon con limon y ajo', 'Hornear por 20 minutos', 'Blanquear el brocoli por 5 minutos', 'Servir con un toque de aceite de oliva'],
      macros: { proteinas: 42, carbos: 8, grasas: 16 }
    },
    {
      id: 3,
      nombre: 'Avena nocturna con chia y berries',
      categoria: 'Desayuno',
      condicion: ['diabetes', 'colesterol', 'peso', 'hipertension'],
      tiempo: '5 min',
      calorias: 280,
      dificultad: 'Muy facil',
      imagen: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80',
      ingredientes: ['1/2 taza de avena', '1 taza de leche descremada', '1 cucharada de chia', '1/2 taza de berries', 'Canela al gusto'],
      pasos: ['Mezclar la avena con la leche', 'Agregar chia y canela', 'Refrigerar toda la noche', 'Servir con berries frescos'],
      macros: { proteinas: 12, carbos: 44, grasas: 6 }
    },
    {
      id: 4,
      nombre: 'Sopa de verduras sin sal',
      categoria: 'Cena',
      condicion: ['renal', 'hipertension'],
      tiempo: '35 min',
      calorias: 180,
      dificultad: 'Facil',
      imagen: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
      ingredientes: ['Zanahoria', 'Repollo', 'Pepino', 'Apio', 'Agua sin sal'],
      pasos: ['Cortar las verduras en cubos', 'Hervir en agua por 20 minutos', 'Agregar hierbas naturales', 'Servir caliente sin sal'],
      macros: { proteinas: 4, carbos: 28, grasas: 1 }
    },
    {
      id: 5,
      nombre: 'Ensalada mediterranea con atun',
      categoria: 'Almuerzo',
      condicion: ['colesterol', 'peso', 'hipertension'],
      tiempo: '15 min',
      calorias: 290,
      dificultad: 'Muy facil',
      imagen: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80',
      ingredientes: ['1 lata de atun al agua', 'Tomate cherry', 'Pepino', 'Aceitunas', 'Aceite de oliva y limon'],
      pasos: ['Cortar los vegetales', 'Mezclar con el atun escurrido', 'Agregar aceitunas', 'Aliñar con oliva y limon'],
      macros: { proteinas: 32, carbos: 12, grasas: 14 }
    },
    {
      id: 6,
      nombre: 'Tortilla de claras con espinaca',
      categoria: 'Desayuno',
      condicion: ['diabetes', 'peso', 'colesterol'],
      tiempo: '10 min',
      calorias: 210,
      dificultad: 'Facil',
      imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80',
      ingredientes: ['4 claras de huevo', '1 taza de espinaca', '1/2 tomate', 'Ajo en polvo', 'Aceite de oliva'],
      pasos: ['Batir las claras con ajo', 'Saltear espinaca y tomate', 'Verter las claras sobre las verduras', 'Cocinar 3 minutos por lado'],
      macros: { proteinas: 28, carbos: 4, grasas: 8 }
    }
  ];

  get recetasFiltradas(): Receta[] {
    if (this.filtroActivo === 'todas') {
      return this.recetas;
    }

    return this.recetas.filter(receta => receta.condicion.includes(this.filtroActivo));
  }

  get tituloFiltroActivo(): string {
    const filtro = this.filtros.find(item => item.key === this.filtroActivo);
    return filtro?.label ?? 'Recetas';
  }

  contarPorFiltro(key: string): number {
    if (key === 'todas') {
      return this.recetas.length;
    }

    return this.recetas.filter(receta => receta.condicion.includes(key)).length;
  }

  abrirReceta(receta: Receta): void {
    this.recetaSeleccionada = receta;
  }

  cerrarReceta(): void {
    this.recetaSeleccionada = null;
  }
}
