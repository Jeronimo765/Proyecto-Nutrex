import { Component, OnInit, ViewChild,
         ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService, ChatMessage } from '../../../core/services/chat.service';

@Component({
  selector:    'app-chat',
  templateUrl: './chat.component.html',
  styleUrls:   ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  messages:   ChatMessage[] = [];
  inputText   = '';
  isTyping    = false;
  userName    = 'Juan';
  conditions  = ['DIABETES_T2'];

  // Sugerencias rápidas para el usuario
  quickSuggestions = [
    '¿Puedo comer arroz?',
    '¿Qué frutas son buenas?',
    'Ideas para la cena',
    'Tengo antojo de dulce',
    '¿Es bueno el aguacate?',
    '¿Cuánta agua debo tomar?'
  ];

  showSuggestions = true;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Mensaje de bienvenida del bot al cargar
    this.messages.push({
      role:      'assistant',
      content:   `¡Hola ${this.userName}! 👋 Soy NutriBot, tu asistente nutricional con IA. Conozco tu plan para diabetes y estoy aquí para ayudarte. ¿Qué necesitas hoy?`,
      timestamp: new Date()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(text?: string): void {
    const content = (text || this.inputText).trim();
    if (!content || this.isTyping) return;

    // Oculta sugerencias después del primer mensaje
    this.showSuggestions = false;
    this.inputText       = '';

    // Agrega el mensaje del usuario
    this.messages.push({
      role:      'user',
      content,
      timestamp: new Date()
    });

    // Muestra indicador de escritura
    this.isTyping = true;

    // Construye el historial para enviar a la API
    const history = this.messages
      .slice(-10)
      .filter(m => m.role !== 'assistant' ||
                   m.content !== this.messages[0].content)
      .map(m => ({ role: m.role, content: m.content }));

    this.chatService.sendMessage({
      message:         content,
      history:         history.slice(0, -1),
      user_conditions: this.conditions,
      user_name:       this.userName
    }).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.messages.push({
          role:      'assistant',
          content:   res.response,
          timestamp: new Date()
        });
      },
      error: () => {
        this.isTyping = false;
        this.messages.push({
          role:      'assistant',
          content:   'Lo siento, tuve un problema al responder. Intenta de nuevo. 🙏',
          timestamp: new Date()
        });
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    // Enter envía, Shift+Enter hace salto de línea
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages         = [];
    this.showSuggestions  = true;
    this.ngOnInit();
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }
}