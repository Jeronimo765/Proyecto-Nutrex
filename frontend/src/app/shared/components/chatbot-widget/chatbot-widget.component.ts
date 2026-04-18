import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';

interface Message {
  role:    'user' | 'assistant';
  content: string;
}

@Component({
  selector:    'app-chatbot-widget',
  templateUrl: './chatbot-widget.component.html',
  styleUrls:   ['./chatbot-widget.component.scss']
})
export class ChatbotWidgetComponent {

  isOpen      = false;
  isTyping    = false;
  inputText   = '';
  conditions  = ['DIABETES_T2'];
  userName    = '';

  messages: Message[] = [
    {
      role:    'assistant',
      content: '¡Hola! 👋 Soy NutriBot. ¿Tienes alguna pregunta sobre tu alimentación?'
    }
  ];

  quickReplies = [
    '¿Qué puedo cenar?',
    '¿El aguacate es bueno?',
    'Ideas de desayuno'
  ];

  showQuickReplies = true;

  constructor(private chatService: ChatService) {}

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  send(text?: string): void {
    const content = (text || this.inputText).trim();
    if (!content || this.isTyping) return;

    this.showQuickReplies = false;
    this.inputText        = '';

    this.messages.push({ role: 'user', content });
    this.isTyping = true;

    const history = this.messages
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content }));

    this.chatService.sendMessage({
      message:         content,
      history:         history.slice(0, -1),
      user_conditions: this.conditions,
      user_name:       this.userName
    }).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.messages.push({ role: 'assistant', content: res.response });
      },
      error: () => {
        this.isTyping = false;
        this.messages.push({
          role:    'assistant',
          content: 'Lo siento, intenta de nuevo. 🙏'
        });
      }
    });
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }
}
