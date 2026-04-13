import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  history: ChatMessagePayload[];
  user_conditions: string[];
  user_name: string;
}

export interface ChatResponsePayload {
  response: string;
  tokens_used: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = 'http://localhost:8000/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(payload: ChatRequestPayload): Observable<ChatResponsePayload> {
    return this.http.post<ChatResponsePayload>(`${this.baseUrl}/`, payload);
  }
}
