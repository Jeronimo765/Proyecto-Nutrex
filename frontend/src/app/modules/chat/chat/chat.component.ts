import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { ChatMessage, ChatService } from '../chat.service';

Chart.register(...registerables);

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;
  @ViewChild('macrosChart') macrosChartRef!: ElementRef;
  @ViewChild('caloriasChart') caloriasChartRef!: ElementRef;

  messages: ChatMessage[] = [];
  inputText = '';
  isTyping = false;
  today = new Date();
  userName = 'U';
  conditions = ['DIABETES_T2'];
  showSuggestions = true;
  macrosChart: Chart | undefined;
  caloriasChart: Chart | undefined;

  scoreNutricional = 72;
  caloriasConsumidas = 1240;
  caloriasMeta = 2000;

  macros = { proteinas: 68, carbos: 142, grasas: 38 };

  tips = [
    'Toma agua antes de cada comida',
    'Evita harinas refinadas en la cena',
    'El aguacate es tu aliado hoy'
  ];

  quickSuggestions = [
    'Si tengo diabetes, que frutas son buenas?',
    'Que verduras son mejores para controlar el azucar?',
    'Puedo comer arroz si tengo diabetes?',
    'Ideas para una cena saludable',
    'Tengo antojo de dulce, que puedo comer?',
    'Cuanta agua debo tomar al dia?'
  ];

  constructor(private chatService: ChatService) {}

  get porcentajeCalorias(): number {
    return Math.round((this.caloriasConsumidas / this.caloriasMeta) * 100);
  }

  ngOnInit(): void {
    this.loadWelcomeMessage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMacrosChart();
      this.initCaloriasChart();
    }, 300);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  initMacrosChart(): void {
    if (!this.macrosChartRef?.nativeElement) {
      return;
    }

    this.macrosChart?.destroy();
    this.macrosChart = new Chart(this.macrosChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Proteinas', 'Carbos', 'Grasas'],
        datasets: [{
          data: [this.macros.proteinas, this.macros.carbos, this.macros.grasas],
          backgroundColor: ['#1D9E75', '#2d5a1b', '#a3c96e'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12 },
              padding: 16,
              color: '#444'
            }
          }
        }
      }
    });
  }

  initCaloriasChart(): void {
    if (!this.caloriasChartRef?.nativeElement) {
      return;
    }

    this.caloriasChart?.destroy();
    this.caloriasChart = new Chart(this.caloriasChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Hoy'],
        datasets: [{
          label: 'Calorias',
          data: [1800, 1650, 2100, 1900, this.caloriasConsumidas],
          backgroundColor: ['#c8dfa8', '#c8dfa8', '#c8dfa8', '#c8dfa8', '#1D9E75'],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 2500,
            grid: { color: '#f0ede6' },
            ticks: { color: '#888', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#555' }
          }
        }
      }
    });
  }

  updateDashboard(texto: string): void {
    const lower = texto.toLowerCase();

    if (lower.includes('desayun') || lower.includes('avena') || lower.includes('huevo')) {
      this.caloriasConsumidas = Math.min(this.caloriasConsumidas + 320, this.caloriasMeta);
      this.macros.proteinas += 8;
      this.macros.carbos += 42;
    }

    if (lower.includes('almuerz') || lower.includes('arroz') || lower.includes('pollo')) {
      this.caloriasConsumidas = Math.min(this.caloriasConsumidas + 480, this.caloriasMeta);
      this.macros.proteinas += 32;
      this.macros.carbos += 58;
    }

    if (lower.includes('cena') || lower.includes('ensalada') || lower.includes('sopa')) {
      this.caloriasConsumidas = Math.min(this.caloriasConsumidas + 280, this.caloriasMeta);
      this.macros.proteinas += 18;
      this.macros.carbos += 24;
    }

    this.scoreNutricional = Math.min(
      100,
      Math.round((this.caloriasConsumidas / this.caloriasMeta) * 85 + 15)
    );

    if (this.macrosChart?.data.datasets[0]) {
      this.macrosChart.data.datasets[0].data = [
        this.macros.proteinas,
        this.macros.carbos,
        this.macros.grasas
      ];
      this.macrosChart.update();
    }

    if (this.caloriasChart?.data.datasets[0]) {
      this.caloriasChart.data.datasets[0].data[4] = this.caloriasConsumidas;
      this.caloriasChart.update();
    }
  }

  sendMessage(text?: string): void {
    const content = (text ?? this.inputText).trim();

    if (!content || this.isTyping) {
      return;
    }

    this.showSuggestions = false;
    this.inputText = '';
    this.messages.push({ role: 'user', content, timestamp: new Date() });
    this.isTyping = true;
    this.updateDashboard(content);

    const history = this.messages.slice(-10).map(({ role, content: messageContent }) => ({
      role,
      content: messageContent
    }));

    this.chatService.sendMessage({
      message: content,
      history: history.slice(0, -1),
      user_conditions: this.conditions,
      user_name: this.userName
    }).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.messages.push({
          role: 'assistant',
          content: res.response,
          timestamp: new Date()
        });
      },
      error: () => {
        this.isTyping = false;
        this.messages.push({
          role: 'assistant',
          content: this.buildFallbackResponse(content),
          timestamp: new Date()
        });
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [];
    this.showSuggestions = true;
    this.today = new Date();
    this.loadWelcomeMessage();
  }

  private loadWelcomeMessage(): void {
    this.messages.push({
      role: 'assistant',
      content: 'Hola, soy NutriBot. Puedo orientarte con preguntas sobre alimentacion, diabetes, frutas, verduras, cenas, antojos y habitos saludables. Que te gustaria consultar hoy?',
      timestamp: new Date()
    });
  }

  private buildFallbackResponse(content: string): string {
    const lower = content.toLowerCase();

    if (lower.includes('diabetes') && (lower.includes('fruta') || lower.includes('frutas'))) {
      return 'Si tienes diabetes, por lo general suelen ir mejor las frutas con mas fibra y menor impacto en el azucar, como manzana, pera, fresas, moras, arandanos, durazno y kiwi. La idea no es solo cual fruta eliges, sino tambien la porcion y con que la acompanas. Una porcion moderada junto con yogur natural, frutos secos o queso fresco suele ayudarte a sentir mas saciedad y a evitar subidas bruscas. Conviene tener mas cuidado con jugos, frutas en almibar y porciones grandes de uvas, mango muy maduro o banano muy grande.';
    }

    if (lower.includes('verdura') || lower.includes('verduras')) {
      return 'Las verduras son una muy buena base si buscas cuidar el azucar en sangre. Las mas recomendables suelen ser las no harinosas: espinaca, brocoli, pepino, lechuga, tomate, zucchini, coliflor, berenjena, habichuela, repollo y pimenton. Puedes usarlas en almuerzos y cenas ocupando buena parte del plato, junto con una proteina y una porcion moderada de carbohidrato. Conviene moderar verduras mas ricas en almidon, como papa, yuca o platano, porque elevan mas rapido la glucosa si se comen en exceso.';
    }

    if (lower.includes('diabetes') && lower.includes('arroz')) {
      return 'Si tienes diabetes, si puedes comer arroz, pero la clave esta en la porcion, el tipo de arroz y lo que lo acompana. Suele funcionar mejor una porcion pequena o moderada, idealmente con pollo, huevo, pescado o legumbres, y bastante ensalada o verduras cocidas. Si puedes elegir, arroz integral o mezclado con vegetales suele dar mas saciedad. Comer un plato grande de arroz solo puede subir mas rapido el azucar que una comida balanceada.';
    }

    if (lower.includes('arroz')) {
      return 'Si, puedes comer arroz. Lo mas importante es controlar la porcion y combinarlo con proteina y vegetales para que la comida quede mas balanceada y tenga menor impacto en el azucar.';
    }

    if (lower.includes('fruta') || lower.includes('frutas')) {
      return 'Buenas opciones suelen ser manzana, pera, fresas, moras, kiwi y otras frutas con buena fibra. Intenta comerlas en porciones moderadas y mejor acompanadas con proteina o grasa saludable, por ejemplo yogur natural o un poco de mani o nueces. En general, es mejor comer la fruta entera que en jugo.';
    }

    if (lower.includes('cena')) {
      return 'Para la cena te recomiendo algo ligero y balanceado. Algunas ideas utiles son pollo con ensalada y aguacate, tortilla de huevo con vegetales, yogur natural con semillas y fruta en porcion moderada, o sopa de verduras con una fuente de proteina. Lo ideal es que la cena tenga proteina, verduras y una cantidad razonable de carbohidratos, para que te deje satisfecho sin sentir pesadez.';
    }

    if (lower.includes('dulce')) {
      return 'Si tienes antojo de dulce, puedes probar opciones mas balanceadas como yogur natural con canela y fruta, una porcion pequena de chocolate oscuro, avena con canela o una tostada con mantequilla de mani. La idea es evitar que el antojo te lleve a grandes cantidades de azucar simple y buscar algo que tambien te aporte saciedad.';
    }

    if (lower.includes('agua')) {
      return 'Como guia general, intenta repartir agua durante todo el dia en vez de tomarla toda de una vez. Un buen comienzo puede ser un vaso al levantarte, uno a media manana, uno antes del almuerzo, otro en la tarde y uno mas con la cena o despues de actividad fisica. La cantidad exacta depende de tu peso, clima y actividad, pero mantener una hidratacion constante ayuda mucho a tu bienestar general.';
    }

    if (lower.includes('aguacate')) {
      return 'Si, el aguacate puede ser una muy buena opcion. Aporta grasas saludables, ayuda con la saciedad y combina bien con desayunos, ensaladas y cenas. Aunque es nutritivo, sigue siendo buena idea comerlo en porciones moderadas para mantener equilibrio en el total del dia.';
    }

    if (lower.includes('desayuno')) {
      return 'Un desayuno util puede incluir proteina, fibra y algo de carbohidrato de buena calidad. Por ejemplo: huevos con avena, yogur natural con fruta y semillas, o pan integral con queso y aguacate. Ese tipo de combinaciones suelen darte mas energia estable y menos hambre a media manana.';
    }

    if (lower.includes('azucar') || lower.includes('glucosa')) {
      return 'Si buscas controlar el azucar en sangre, suele ayudar mucho organizar comidas con tres partes: una fuente de proteina, una buena cantidad de verduras y una porcion moderada de carbohidrato. Tambien conviene evitar bebidas azucaradas, jugos y panes o postres muy refinados en grandes cantidades. Comer a horarios parecidos y caminar un poco despues de algunas comidas tambien puede ayudar.';
    }

    return 'Puedo ayudarte con temas como diabetes, control del azucar, frutas recomendadas, verduras, ideas de desayuno o cena, antojos de dulce e hidratacion. Puedes preguntarme, por ejemplo: si tengo diabetes que frutas son buenas, que verduras me convienen o puedo comer arroz.';
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }
}
