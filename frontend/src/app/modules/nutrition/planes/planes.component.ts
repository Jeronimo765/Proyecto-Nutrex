import { Component } from '@angular/core';

interface SemanaPlan {
  semana: number;
  desayuno: string;
  almuerzo: string;
  cena: string;
}

interface Plan {
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

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent {
  planSeleccionado: Plan | null = null;

  readonly planes: Plan[] = [
    {
      id: 'diabetes',
      condicion: 'Diabetes tipo 2',
      tipoPlan: 'Control glucemico',
      objetivo: 'Mantener glucosa estable con fibra, proteina magra y carbohidratos de absorcion lenta.',
      descripcion: 'Plan enfocado en bajar picos de azucar y mejorar la saciedad durante el dia.',
      enfoque: [
        'Porciones moderadas de carbohidratos complejos',
        'Verduras en cada comida principal',
        'Proteina magra para mejorar saciedad'
      ],
      alimentos: ['Avena', 'Quinoa', 'Verduras verdes', 'Pollo a la plancha', 'Legumbres', 'Aguacate'],
      evitar: ['Azucar blanca', 'Pan blanco', 'Jugos de fruta', 'Arroz blanco', 'Dulces'],
      semanas: [
        { semana: 1, desayuno: 'Avena con canela y arandanos', almuerzo: 'Ensalada de quinoa con pollo', cena: 'Sopa de lentejas con verduras' },
        { semana: 2, desayuno: 'Huevos revueltos con espinaca', almuerzo: 'Filete de tilapia con brocoli', cena: 'Crema de zapallo sin azucar' },
        { semana: 3, desayuno: 'Yogur natural con semillas de chia', almuerzo: 'Pechuga con ensalada verde', cena: 'Tofu salteado con vegetales' },
        { semana: 4, desayuno: 'Tostada integral con aguacate', almuerzo: 'Garbanzos con espinaca', cena: 'Caldo de pollo con verduras' }
      ]
    },
    {
      id: 'hipertension',
      condicion: 'Hipertension',
      tipoPlan: 'Dieta DASH',
      objetivo: 'Reducir sodio y fortalecer el consumo de potasio, magnesio y alimentos frescos.',
      descripcion: 'Plan para apoyar el control de la presion arterial con comidas caseras y poco sodio.',
      enfoque: [
        'Reducir embutidos, enlatados y sal agregada',
        'Incluir vegetales y frutas ricas en potasio',
        'Priorizar preparaciones al horno, vapor o plancha'
      ],
      alimentos: ['Banano', 'Espinaca', 'Avena', 'Salmon', 'Nueces', 'Remolacha'],
      evitar: ['Sal en exceso', 'Embutidos', 'Enlatados', 'Comida rapida', 'Alcohol'],
      semanas: [
        { semana: 1, desayuno: 'Avena con banano y nueces', almuerzo: 'Salmon al horno con espinaca', cena: 'Crema de remolacha sin sal' },
        { semana: 2, desayuno: 'Smoothie de espinaca y mango', almuerzo: 'Pollo a la plancha con papa', cena: 'Sopa de vegetales casera' },
        { semana: 3, desayuno: 'Tostada integral con tomate', almuerzo: 'Atun fresco con ensalada', cena: 'Lentejas guisadas sin sal' },
        { semana: 4, desayuno: 'Yogur con fresas y semillas', almuerzo: 'Pavo con verduras al vapor', cena: 'Caldo vegetal con quinoa' }
      ]
    },
    {
      id: 'colesterol',
      condicion: 'Colesterol alto',
      tipoPlan: 'Cardiosaludable',
      objetivo: 'Disminuir grasas saturadas y aumentar fibra soluble y grasas saludables.',
      descripcion: 'Plan orientado a proteger el corazon y mejorar el perfil lipidico a mediano plazo.',
      enfoque: [
        'Usar aceite de oliva y frutos secos con medida',
        'Agregar avena, frutas y verduras altas en fibra',
        'Limitar fritos, carnes rojas y lacteos enteros'
      ],
      alimentos: ['Avena', 'Aceite de oliva', 'Almendras', 'Manzana', 'Salmon', 'Berries'],
      evitar: ['Frituras', 'Mantequilla', 'Carnes rojas', 'Lacteos enteros', 'Embutidos'],
      semanas: [
        { semana: 1, desayuno: 'Avena con manzana y canela', almuerzo: 'Salmon con ensalada de espinaca', cena: 'Sopa de verduras con aceite de oliva' },
        { semana: 2, desayuno: 'Smoothie de berries con avena', almuerzo: 'Pechuga con vegetales al vapor', cena: 'Crema de brocoli con almendras' },
        { semana: 3, desayuno: 'Tostada integral con aguacate', almuerzo: 'Atun con ensalada mediterranea', cena: 'Lentejas con zanahoria' },
        { semana: 4, desayuno: 'Yogur descremado con nueces', almuerzo: 'Pollo al horno con berenjena', cena: 'Sopa de champinones' }
      ]
    },
    {
      id: 'renal',
      condicion: 'Enfermedad renal',
      tipoPlan: 'Cuidado renal',
      objetivo: 'Controlar sodio, potasio y fosforo con menus suaves y bien dosificados.',
      descripcion: 'Plan pensado para proteger la funcion renal y simplificar la seleccion diaria de alimentos.',
      enfoque: [
        'Elegir alimentos bajos en potasio y fosforo',
        'Moderar proteinas segun tolerancia y control medico',
        'Evitar procesados y exceso de sal'
      ],
      alimentos: ['Arroz blanco', 'Manzana', 'Pollo sin piel', 'Repollo', 'Pepino', 'Pan blanco'],
      evitar: ['Banano', 'Nueces', 'Lacteos', 'Legumbres', 'Sal', 'Alimentos procesados'],
      semanas: [
        { semana: 1, desayuno: 'Pan blanco con mermelada sin azucar', almuerzo: 'Arroz blanco con pollo sin sal', cena: 'Sopa de repollo y zanahoria' },
        { semana: 2, desayuno: 'Manzana con pan tostado', almuerzo: 'Pechuga hervida con pepino', cena: 'Arroz con verduras bajas en potasio' },
        { semana: 3, desayuno: 'Gelatina sin azucar con pera', almuerzo: 'Pollo a la plancha con repollo', cena: 'Caldo suave de pollo sin sal' },
        { semana: 4, desayuno: 'Tostada con aceite de oliva', almuerzo: 'Arroz con pechuga y rabano', cena: 'Sopa de nabo y zanahoria' }
      ]
    },
    {
      id: 'obesidad',
      condicion: 'Control de peso',
      tipoPlan: 'Perdida de grasa',
      objetivo: 'Lograr un deficit calorico con buena saciedad y comidas faciles de sostener.',
      descripcion: 'Plan con enfoque en proteina magra, fibra y orden de comidas para bajar peso sin rebotes.',
      enfoque: [
        'Platos altos en vegetales y proteina magra',
        'Menos azucar liquida y ultraprocesados',
        'Desayunos y cenas de alta saciedad'
      ],
      alimentos: ['Pechuga de pollo', 'Brocoli', 'Huevo', 'Quinoa', 'Pepino', 'Frutas frescas'],
      evitar: ['Ultraprocesados', 'Bebidas azucaradas', 'Pan blanco', 'Frituras', 'Alcohol'],
      semanas: [
        { semana: 1, desayuno: 'Huevos con espinaca y cafe sin azucar', almuerzo: 'Ensalada de pollo con quinoa', cena: 'Sopa de verduras sin grasa' },
        { semana: 2, desayuno: 'Yogur griego con fresas', almuerzo: 'Pechuga a la plancha con brocoli', cena: 'Crema de zapallo sin crema' },
        { semana: 3, desayuno: 'Smoothie verde con proteina', almuerzo: 'Atun con ensalada mixta', cena: 'Pollo al horno con vegetales' },
        { semana: 4, desayuno: 'Avena con proteina y berries', almuerzo: 'Bowl de quinoa con vegetales', cena: 'Sopa de lentejas ligera' }
      ]
    },
    {
      id: 'general',
      condicion: 'Nutricion general',
      tipoPlan: 'Balance diario',
      objetivo: 'Mejorar habitos con un patron equilibrado y sostenible para todos los dias.',
      descripcion: 'Plan ideal para personas que quieren comer mejor, ordenar horarios y mantener energia estable.',
      enfoque: [
        'Mitad del plato con verduras variadas',
        'Granos integrales y proteina en cada comida',
        'Menos ultraprocesados y mejor hidratacion'
      ],
      alimentos: ['Frutas variadas', 'Verduras', 'Granos integrales', 'Proteina magra', 'Legumbres', 'Agua'],
      evitar: ['Ultraprocesados', 'Azucar en exceso', 'Grasas trans', 'Alcohol en exceso'],
      semanas: [
        { semana: 1, desayuno: 'Tazon de frutas con granola', almuerzo: 'Arroz integral con pollo y ensalada', cena: 'Sopa de verduras casera' },
        { semana: 2, desayuno: 'Smoothie de mango y espinaca', almuerzo: 'Pasta integral con vegetales', cena: 'Tortilla de verduras' },
        { semana: 3, desayuno: 'Tostadas con aguacate y huevo', almuerzo: 'Quinoa con salmon y limon', cena: 'Ensalada mediterranea completa' },
        { semana: 4, desayuno: 'Yogur con miel y nueces', almuerzo: 'Bowl de legumbres mixtas', cena: 'Wok de vegetales con tofu' }
      ]
    }
  ];

  seleccionar(plan: Plan): void {
    this.planSeleccionado = this.planSeleccionado?.id === plan.id ? null : plan;
  }
}
